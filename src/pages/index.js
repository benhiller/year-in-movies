import { useMemo, useState } from 'react';
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

const filterMovies = (movieData, filter) => {
  if (filter.director) {
    return movieData.filter((movie) => movie.director === filter.director);
  } else if (filter.actor) {
    return movieData.filter(
      (movie) => movie.cast && movie.cast.includes(filter.actor),
    );
  }
};

const Home = ({ movieData }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);

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

  const filteredMovies = useMemo(
    () =>
      selectedFilter ? filterMovies(movieData, selectedFilter) : movieData,
    [movieData, selectedFilter],
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Ben&apos;s Year in Movies - 2020</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.content}>
        <div>First movie watched: {firstTitle}</div>
        <div>Last movie watched: {lastTitle}</div>
        <div>
          Top Directors:
          <ol>
            {topDirectors.slice(0, 5).map((director, idx) => (
              <li key={director[0]}>
                <a onClick={() => setSelectedFilter({ director: director[0] })}>
                  {director[0]}
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div>
          Top Actors:
          <ol>
            {topActors.slice(0, 5).map((actor, idx) => (
              <li key={actor[0]}>
                <a onClick={() => setSelectedFilter({ actor: actor[0] })}>
                  {actor[0]}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className={styles.posters}>
        {selectedFilter && (
          <a className={styles.clear} onClick={() => setSelectedFilter(null)}>
            Clear
          </a>
        )}
        {filteredMovies.map((movie, idx) => (
          <img src={movie.poster} key={movie.title} />
        ))}
      </div>
    </div>
  );
};

export default Home;
