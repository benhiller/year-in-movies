import { useMemo, useState } from 'react';

import styles from 'styles/App.module.css';
import MetricSection from 'components/MetricSection';
import RankedMetric from 'components/RankedMetric';
import PostersGrid from 'components/PostersGrid';
import Footer from 'components/Footer';
import {
  computeTopDirectors,
  computeTopCastMembers,
  computeTopGenres,
  computeDecadesHistogram,
  computeMonthsHistogram,
  computeTimeSpent,
  computeLongestMovie,
  computeShortestMovie,
  computeLeastRatedMovie,
  computeMostRatedMovie,
  computeLowestRatedMovie,
  computeHighestRatedMovie,
  monthFromDate,
} from 'metrics';

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
  } else if (filter.genre) {
    return movieData.filter((movie) => movie.genres.includes(filter.genre));
  } else if (filter.month) {
    return movieData.filter(
      (movie) => monthFromDate(movie.watchDate) === filter.month,
    );
  } else if (filter.title) {
    return movieData.filter((movie) => movie.title === filter.title);
  }
};

const titleForFilter = (filter) => {
  if (filter.director) {
    return `Director: ${filter.director}`;
  } else if (filter.castMember) {
    return `Cast Member: ${filter.castMember}`;
  } else if (filter.decade) {
    return `Release Year: ${filter.decade}`;
  } else if (filter.genre) {
    return `Genre: ${filter.genre}`;
  } else if (filter.month) {
    return `Watched in: ${filter.month}`;
  } else if (filter.title) {
    return filter.title;
  }
};

// Probably should specify per-emoji padding values to get better alignment...
// though maybe that is too Apple specific?
// TODO - remove alternative emojis
const emojiForGenre = (genre) => {
  switch (genre) {
    case 'Action':
      return '\uD83E\uDD35\uFE0F'; // man in tux (like james bond?)
    case 'Adventure':
      return '\uD83E\uDDF3'; // luggage
    // return '\uD83E\uDD20'; // cowboy hat face (like indiana jones?)
    // map?
    case 'Animation':
      return '\uD83D\uDC2D'; // mouse
    // return '\uD83C\uDFA8'; // palette
    // mouse?
    case 'Comedy':
      return '\uD83E\uDD21'; // clown
    case 'Crime':
      return '\uD83D\uDC6E\u200D\u2642\uFE0F'; // police
    // cop car? siren?
    case 'Documentary':
      return '\uD83D\uDDDE\uFE0F'; // rolled-up newspaper
    // return '\uD83D\uDCF0'; // newspaper
    case 'Drama':
      return '\uD83C\uDFAD'; // comedy + tragedy masks
      return '\uD83D\uDE4E\u200D\u2642\uFE0F'; // man pouting
    // broken heart?
    case 'Family':
      return '\uD83D\uDC6A';
    // return '\uD83D\uDC68\u200D\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC66';
    case 'Fantasy':
      return '\uD83E\uDDD9\u200D\u2642\uFE0F'; // man mage
    // return '\uD83E\uDDDA'; // fairy
    // return '\uD83E\uDDD9'; // mage
    case 'History':
      return '\uD83D\uDDFF'; // moyai
    // greek vase?
    case 'Horror':
      // return '\uD83D\uDC7B'; // ghost
      // return '\uD83E\uDDDB\u200D\u2642\uFE0F'; // vampire
      return '\uD83E\uDDDF\u200D\u2642\uFE0F'; // zombie
    case 'Music':
      return '\uD83C\uDFB8'; // guitar
    // return '\uD83C\uDFB7'; // sax
    case 'Mystery':
      return '\uD83D\uDD75\uFE0F';
    case 'Romance':
      return '\uD83D\uDC8B'; // kiss mark
    case 'Science Fiction':
      // return '\uD83D\uDC7D'; // alien
      return '\uD83D\uDC68\u200D\uD83D\uDE80'; // astronaut
    // return '\uD83E\uDD16'; // robot
    // space ship?
    case 'TV Movie':
      return '\uD83D\uDCFA'; // television
    case 'Thriller':
      return '\uD83D\uDD2A'; // knife
    case 'War':
      return '\uD83C\uDF96\uFE0F'; // military medal
    // bomb?
    case 'Western':
      return '\uD83E\uDD20'; // cowboy hat face (like indiana jones?)
    // return '\uD83D\uDC34'; // horse
    // cowboy hat face?
    default:
      return '\uD83C\uDFA6'; // movie camera icon
  }
};

const Home = ({ movieData }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);

  // const allGenres = [
  //   'Action',
  //   'Adventure',
  //   'Animation',
  //   'Comedy',
  //   'Crime',
  //   'Documentary',
  //   'Drama',
  //   'Family',
  //   'Fantasy',
  //   'History',
  //   'Horror',
  //   'Music',
  //   'Mystery',
  //   'Romance',
  //   'Science Fiction',
  //   'TV Movie',
  //   'Thriller',
  //   'War',
  //   'Western',
  //   'Default',
  // ];

  const {
    topDirectors,
    topCastMembers,
    topGenres,
    decadesHistogram,
    monthsHistogram,
    timeSpent,
    longestMovie,
    shortestMovie,
    leastRatedMovie,
    mostRatedMovie,
    lowestRatedMovie,
    highestRatedMovie,
  } = useMemo(
    () => ({
      topDirectors: computeTopDirectors(movieData),
      topCastMembers: computeTopCastMembers(movieData),
      topGenres: computeTopGenres(movieData),
      decadesHistogram: computeDecadesHistogram(movieData),
      monthsHistogram: computeMonthsHistogram(movieData),
      timeSpent: computeTimeSpent(movieData),
      longestMovie: computeLongestMovie(movieData),
      shortestMovie: computeShortestMovie(movieData),
      leastRatedMovie: computeLeastRatedMovie(movieData),
      mostRatedMovie: computeMostRatedMovie(movieData),
      lowestRatedMovie: computeLowestRatedMovie(movieData),
      highestRatedMovie: computeHighestRatedMovie(movieData),
    }),
    [movieData],
  );

  const movieCount = movieData.length;

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
        <MetricSection metricName={'\uD83C\uDF9E\uFE0F Most Watched Genres'}>
          <RankedMetric
            items={topGenres.slice(0, 15).map(([genre, count]) => ({
              count,
              name: genre,
              emoji: emojiForGenre(genre),
            }))}
            onClickItem={(itemName) => {
              setSelectedFilter({ genre: itemName });
            }}
          />
        </MetricSection>
        <MetricSection metricName={'\uD83C\uDFAC Most Watched Directors'}>
          <RankedMetric
            items={topDirectors.slice(0, 15).map(({ director, count }) => ({
              count,
              name: director.name,
              imageSrc: director.imageSrc
                ? `https://image.tmdb.org/t/p/w180_and_h180_face${director.imageSrc}`
                : null,
            }))}
            onClickItem={(itemName) => {
              setSelectedFilter({ director: itemName });
            }}
          />
        </MetricSection>
        <MetricSection metricName={'\uD83C\uDFC6 Most Watched Actors'}>
          <RankedMetric
            items={topCastMembers.slice(0, 15).map(({ castMember, count }) => ({
              count,
              name: castMember.name,
              imageSrc: castMember.imageSrc
                ? `https://image.tmdb.org/t/p/w180_and_h180_face${castMember.imageSrc}`
                : null,
            }))}
            onClickItem={(itemName) => {
              setSelectedFilter({ castMember: itemName });
            }}
          />
        </MetricSection>
        <MetricSection
          metricName={'\uD83D\uDDD3\uFE0F Movies Watched by Decade'}
        >
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
        </MetricSection>
        <MetricSection
          metricName={'\uD83C\uDF9F\uFE0F Movies Watched by Month'}
        >
          <ol>
            {monthsHistogram.slice(0, 5).map((month) => (
              <li key={month[0]}>
                <button onClick={() => setSelectedFilter({ month: month[0] })}>
                  {month[0]}: {month[1]}
                </button>
              </li>
            ))}
          </ol>
        </MetricSection>
        <div className={styles.summary}>
          <div className={styles.summaryStat}>
            <div>Longest Movie Watched</div>
            <div
              onClick={() => setSelectedFilter({ title: longestMovie.title })}
            >
              {longestMovie.title}{' '}
              <span>
                ({Math.floor(longestMovie.runtime / 60)}h{' '}
                {longestMovie.runtime % 60}m)
              </span>
            </div>
          </div>
          <div className={styles.summaryStat}>
            <div>Most Obscure Movie Watched</div>
            <div
              onClick={() =>
                setSelectedFilter({ title: leastRatedMovie.title })
              }
            >
              {leastRatedMovie.title}{' '}
              <span>({leastRatedMovie.voteCount} ratings)</span>
            </div>
          </div>
          <div className={styles.summaryStat}>
            <div>Least Popular Movie Watched</div>
            <div
              onClick={() =>
                setSelectedFilter({ title: lowestRatedMovie.title })
              }
            >
              {lowestRatedMovie.title}{' '}
              <span>({lowestRatedMovie.averageVote} average rating)</span>
            </div>
          </div>
        </div>
        <Footer />
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
