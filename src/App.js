import { useMemo, useState } from 'react';

import styles from './styles/App.module.css';
import PostersGrid from './PostersGrid.jsx';

const filterMovies = (movieData, filter) => {
  if (filter.director) {
    return movieData.filter((movie) => movie.director.name === filter.director);
  } else if (filter.actor) {
    return movieData.filter(
      (movie) =>
        movie.cast && movie.cast.map((c) => c.name).includes(filter.actor),
    );
  } else if (filter.decade) {
    return movieData.filter((movie) =>
      movie.releaseDate.startsWith(filter.decade.slice(0, 3)),
    );
  }
};

const titleForFilter = (filter) => {
  if (filter.director) {
    return `Director: ${filter.director}`;
  } else if (filter.actor) {
    return `Cast Member: ${filter.actor}`;
  } else if (filter.decade) {
    return `Release Year: ${filter.decade}`;
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

          if (acc[director.name]) {
            acc[director.name] = acc[director.name] + 1;
          } else {
            acc[director.name] = 1;
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
            if (acc[castMember.name]) {
              acc[castMember.name] = acc[castMember.name] + 1;
            } else {
              acc[castMember.name] = 1;
            }
          });
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
    [movieData],
  );

  const topDecades = useMemo(
    () =>
      Object.entries(
        movieData.reduce((acc, movie) => {
          const decade = parseInt(movie.releaseDate.slice(0, 3)) * 10;
          const decadeLabel = `${decade}'s`;
          if (acc[decadeLabel]) {
            acc[decadeLabel] = acc[decadeLabel] + 1;
          } else {
            acc[decadeLabel] = 1;
          }
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
    [movieData],
  );

  const movieCount = movieData.length;
  const timeSpent = useMemo(
    () => movieData.reduce((acc, movie) => acc + movie.runtime, 0),
    [movieData],
  );

  const firstTitle = movieData[0].title;
  const lastTitle = movieData[movieData.length - 1].title;

  const filteredMovies = useMemo(
    () =>
      selectedFilter ? filterMovies(movieData, selectedFilter) : movieData,
    [movieData, selectedFilter],
  );

  const currentTitle = selectedFilter
    ? titleForFilter(selectedFilter)
    : 'All Movies';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.summary}>
          <div className={styles.summaryStat}>
            <div>Movies Watched</div>
            <div>{movieCount}</div>
          </div>
          <div className={styles.summaryStat}>
            <div>Time Spent</div>
            <div>
              {Math.floor(timeSpent / 60)}h {timeSpent % 60}m
            </div>
          </div>
        </div>
        <div className={styles.summary}>
          <div className={styles.summaryStat}>
            <div>First Movie Watched</div>
            <div>{firstTitle}</div>
          </div>
          <div className={styles.summaryStat}>
            <div>Last Movie Watched</div>
            <div>{lastTitle}</div>
          </div>
        </div>
        <div>
          Top Directors:
          <ol>
            {topDirectors.slice(0, 5).map((director) => (
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
            {topActors.slice(0, 5).map((actor) => (
              <li key={actor[0]}>
                <a onClick={() => setSelectedFilter({ actor: actor[0] })}>
                  {actor[0]}
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div>
          Top Decades:
          <ol>
            {topDecades.slice(0, 5).map((decade) => (
              <li key={decade[0]}>
                <a onClick={() => setSelectedFilter({ decade: decade[0] })}>
                  {decade[0]}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className={styles.postersContainer}>
        <div className={styles.controls}>
          <span>{currentTitle}</span>
          {selectedFilter && (
            <a className={styles.clear} onClick={() => setSelectedFilter(null)}>
              Clear
            </a>
          )}
        </div>
        {typeof window !== 'undefined' && (
          <PostersGrid movies={filteredMovies} />
        )}
      </div>
    </div>
  );
};

export default Home;