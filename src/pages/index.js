import { useMemo } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import movieData from '../../data/processed-movies.json';

export const getStaticProps = async () => {
  return {
    props: {
      movieData,
    },
  };
};

const Home = ({ movieData }) => {
  const topDirectors = useMemo(
    () =>
      Object.entries(
        movieData.reduce((acc, movie) => {
          const { director } = movie;
          if (!director) {
            return acc;
          }

          if (acc[director]) {
            acc[director] = acc[director] + 1;
          } else {
            acc[director] = 1;
          }
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
    [movieData],
  );

  const topActors = useMemo(
    () =>
      Object.entries(
        movieData.reduce((acc, movie) => {
          const { cast } = movie;
          if (!cast) {
            return acc;
          }

          cast.forEach((castMember) => {
            if (acc[castMember]) {
              acc[castMember] = acc[castMember] + 1;
            } else {
              acc[castMember] = 1;
            }
          });
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
    [movieData],
  );

  const firstTitle = movieData[0].title;
  const lastTitle = movieData[movieData.length - 1].title;

  return (
    <div className={styles.container}>
      <Head>
        <title>Ben&apos;s Year in Movies - 2020</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>First movie watched: {firstTitle}</div>
        <div>Last movie watched: {lastTitle}</div>
        <div>
          Top Directors:
          <ol>
            {topDirectors.slice(0, 5).map((director, idx) => (
              <li key={idx}>{director[0]}</li>
            ))}
          </ol>
        </div>
        <div>
          Top Actors:
          <ol>
            {topActors.slice(0, 5).map((actor, idx) => (
              <li key={idx}>{actor[0]}</li>
            ))}
          </ol>
        </div>
        <div>
          Posters
          <br />
          {movieData.map((movie, idx) => (
            <img
              src={movie.poster}
              key={idx}
              style={{ width: '50px', height: '75px' }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
