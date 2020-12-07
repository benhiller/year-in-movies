require('dotenv').config();

const fs = require('fs');
const fetch = require('node-fetch');

const fetchAirtablePage = async (offset) => {
  const filter = encodeURIComponent("IS_AFTER({Date}, '2019-12-31')");
  // TODO - remove pageSize to fetch more movies at once
  let url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Movies?maxRecords=200&filterByFormula=${filter}&sort[0][field]=Date&sort[0][direction]=asc&pageSize=15`;
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
    // TODO - delete to fetch all movies
    break;
  }
  return records;
};

const findMovieId = async (title, year) => {
  const searchResultsResp = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${
      process.env.TMDB_API_KEY
    }&query=${encodeURIComponent(title)}`,
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
    case 'Twilight':
      movieId = '298275';
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
    return fs.promises.writeFile('data/movies.json', JSON.stringify(details));
  })
  .catch((err) => {
    console.error(err);
  });