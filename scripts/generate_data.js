require('dotenv').config();

const fs = require('fs');
const fetch = require('node-fetch');

const fetchAirtablePage = async (offset) => {
  let url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Movies?sort[0][field]=Date&sort[0][direction]=asc`;
  if (offset) {
    url = url + `&offset=${offset}`;
  }
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  });
  return resp.json();
};

const fetchAllAirtableRecords = async () => {
  let json = await fetchAirtablePage(null);
  let records = [...json.records];

  while (json.offset) {
    json = await fetchAirtablePage(json.offset);
    records = [...records, ...json.records];
  }
  return records;
};

const findMovieId = async (title, year) => {
  const searchResultsResp = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${
      process.env.TMDB_API_KEY
    }&query=${encodeURIComponent(title)}&year=${year}`,
  );
  const searchResults = await searchResultsResp.json();
  const matchedSearchResult = searchResults.results.find((searchResult) =>
    searchResult.release_date.startsWith(year),
  );

  if (!matchedSearchResult) {
    console.log(`Couldn't find details for ${title} (${year})`);
    return null;
  }

  return matchedSearchResult.id;
};

const fetchTMDBDetailsForMovie = async (record) => {
  const title = record.fields.Name;
  const year = record.fields['Release Year'];
  let movieId;
  // Special cases for some movies with difficult to query titles
  switch (title) {
    case '$':
      movieId = '31644';
      break;
    case 'F for Fake':
      movieId = '43003';
      break;
    case 'High':
      movieId = '163526';
      break;
    case 'The Vampire of Düsseldorf':
      movieId = '65978';
      break;
    case 'Cold War':
      movieId = '440298';
      break;
    case 'Time and Tide':
      movieId = '49291';
      break;
    case 'Apples':
      movieId = '652156';
      break;
    case 'Showing Up':
      movieId = '790416';
      break;

    default:
      movieId = await findMovieId(title, year);
  }

  const detailsResp = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,images`,
  );
  const details = await detailsResp.json();
  return { record, details };
};

fetchAllAirtableRecords()
  .then((records) => {
    return Promise.all(records.map((movie) => fetchTMDBDetailsForMovie(movie)));
  })
  .then((details) => {
    if (!fs.existsSync('raw-data')) {
      fs.mkdirSync('raw-data');
    }

    return fs.promises.writeFile(
      'raw-data/movies.json',
      JSON.stringify(details),
    );
  })
  .catch((err) => {
    console.error(err);
  });
