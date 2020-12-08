import { useMemo, useState } from 'react';

import styles from './styles/App.module.css';
import PostersGrid from './PostersGrid.jsx';

const filterMovies = (movieData, filter) => {
  if (filter.director) {
    return movieData.filter((movie) => movie.director.name === filter.director);
  } else if (filter.castMember) {
    return movieData.filter(
      (movie) =>
        movie.cast && movie.cast.map((c) => c.name).includes(filter.castMember),
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
  } else if (filter.castMember) {
    return `Cast Member: ${filter.castMember}`;
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
            const { count } = acc[director.name];
            acc[director.name] = { director, count: count + 1 };
          } else {
            acc[director.name] = { director, count: 1 };
          }
          return acc;
        }, {}),
      )
        .sort((a, b) => b[1].count - a[1].count)
        .map(([_, { director }]) => director),
    [movieData],
  );

  const topCastMembers = useMemo(
    () =>
      Object.entries(
        movieData.reduce((acc, movie) => {
          const { cast } = movie;
          if (!cast) {
            return acc;
          }

          cast.forEach((castMember) => {
            if (acc[castMember.name]) {
              const { count } = acc[castMember.name];
              acc[castMember.name] = { castMember, count: count + 1 };
            } else {
              acc[castMember.name] = { castMember, count: 1 };
            }
          });
          return acc;
        }, {}),
      )
        .sort((a, b) => b[1].count - a[1].count)
        .map(([_, { castMember }]) => castMember),
    [movieData],
  );

  const decadesHistogram = useMemo(
    () =>
      Object.entries(
        movieData.reduce((acc, movie) => {
          const decade = parseInt(movie.releaseDate.slice(0, 3)) * 10;
          const decadeLabel = `${decade}s`;
          if (acc[decadeLabel]) {
            acc[decadeLabel] = acc[decadeLabel] + 1;
          } else {
            acc[decadeLabel] = 1;
          }
          return acc;
        }, {}),
      ),
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
          <span className={styles.sectionTitle}>
            {'\uD83C\uDFAC'} Top Directors
          </span>
          <ol>
            {topDirectors.slice(0, 15).map((director, idx) => (
              <li key={director.name}>
                <button
                  onClick={() => setSelectedFilter({ director: director.name })}
                >
                  {director.imageSrc ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w180_and_h180_face${director.imageSrc}`}
                      alt={director.name}
                    />
                  ) : (
                    <div className={styles.directorPlaceholder} />
                  )}
                  <span>{director.name}</span>{' '}
                  {/* TODO - split name so last name is always on last line? */}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <span className={styles.sectionTitle}>
            {'\uD83C\uDFAD'} Top Genres
          </span>
        </div>
        <div>
          <span className={styles.sectionTitle}>
            {'\uD83C\uDFC6'} Top Cast Members
          </span>
          <ol>
            {topCastMembers.slice(0, 15).map((castMember, idx) => (
              <li key={castMember.name}>
                <button
                  onClick={() =>
                    setSelectedFilter({ castMember: castMember.name })
                  }
                >
                  {castMember.imageSrc ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w180_and_h180_face${castMember.imageSrc}`}
                      alt={castMember.name}
                    />
                  ) : (
                    <div className={styles.directorPlaceholder} />
                  )}
                  <span>
                    {idx + 1}. {castMember.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <span className={styles.sectionTitle}>
            {'\uD83D\uDDD3\uFE0F'} Movies by Decade
          </span>
          <ol>
            {decadesHistogram.slice(0, 5).map((decade) => (
              <li key={decade[0]}>
                <button
                  onClick={() => setSelectedFilter({ decade: decade[0] })}
                >
                  {decade[0]}: {decade[1]}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <span className={styles.sectionTitle}>
            {'\uD83C\uDF9F\uFE0F'} Movie Schedule
          </span>
        </div>
        <div>
          <span className={styles.sectionTitle}>
            {/* TODO - need to use emoji here, not unicode */}
            {'\u25B6'} Movies by Source
          </span>
        </div>
      </div>
      <div className={styles.postersContainer}>
        <div className={styles.controls}>
          <span>{currentTitle}</span>
          {selectedFilter && (
            <button
              className={styles.clear}
              onClick={() => setSelectedFilter(null)}
            >
              Clear
            </button>
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
