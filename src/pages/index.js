import Head from 'next/head';
import styles from '../styles/Home.module.css';

export const getStaticProps = async (context) => {
  const resp = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Movies?maxRecords=3&view=All%20Entries`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    },
  );
  const records = await resp.json();

  const movie = records.records[0];
  const searchResultsResp = await fetch(
    // TODO - url encode name
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${movie.fields.Name}`,
  );
  const searchResults = await searchResultsResp.json();
  const matchedSearchResult = searchResults.results.find((searchResult) =>
    searchResult.release_date.startsWith(movie.fields['Release Year']),
  );

  return { props: { matchedSearchResult } };
};

const Home = ({ matchedSearchResult }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>2020 - Ben&apos;s Year in Movies</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        Last movie watched: {matchedSearchResult.title}
      </main>
    </div>
  );
};

export default Home;
