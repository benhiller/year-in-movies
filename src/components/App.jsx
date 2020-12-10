import { useMemo, useState } from 'react';
import classNames from 'classnames';

import styles from 'styles/App.module.css';
import MetricSection from 'components/MetricSection';
import RankedMetric from 'components/RankedMetric';
import PostersGrid from 'components/PostersGrid';
import Histogram from 'components/Histogram';
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
  labelForMonth,
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
      (movie) => labelForMonth(monthFromDate(movie.watchDate)) === filter.month,
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

// TODO - Probably should specify per-emoji padding values to get better
// alignment. though maybe that is too Apple specific?
const emojiForGenre = (genre) => {
  switch (genre) {
    case 'Action':
      return '\uD83E\uDD35\uFE0F'; // man in tux (like james bond)
    case 'Adventure':
      return '\uD83E\uDDF3'; // luggage
    case 'Animation':
      return '\uD83D\uDC2D'; // mouse
    case 'Comedy':
      return '\uD83E\uDD21'; // clown
    case 'Crime':
      return '\uD83D\uDC6E\u200D\u2642\uFE0F'; // police
    case 'Documentary':
      return '\uD83D\uDDDE\uFE0F'; // rolled-up newspaper
    case 'Drama':
      return '\uD83C\uDFAD'; // comedy + tragedy masks
    case 'Family':
      return '\uD83D\uDC6A';
    case 'Fantasy':
      return '\uD83E\uDDD9\u200D\u2642\uFE0F'; // man mage
    case 'History':
      return '\uD83D\uDDFF'; // moyai
    case 'Horror':
      return '\uD83E\uDDDF\u200D\u2642\uFE0F'; // zombie
    case 'Music':
      return '\uD83C\uDFB8'; // guitar
    case 'Mystery':
      return '\uD83D\uDD75\uFE0F';
    case 'Romance':
      return '\uD83D\uDC8B'; // kiss mark
    case 'Science Fiction':
      return '\uD83D\uDC68\u200D\uD83D\uDE80'; // astronaut
    case 'TV Movie':
      return '\uD83D\uDCFA'; // television
    case 'Thriller':
      return '\uD83D\uDD2A'; // knife
    case 'War':
      return '\uD83C\uDF96\uFE0F'; // military medal
    case 'Western':
      return '\uD83E\uDD20'; // cowboy hat face (like indiana jones)
    default:
      return '\uD83C\uDFA6'; // movie camera icon
  }
};

const generateMonths = () =>
  [...Array(12).keys()].map((i) => ({
    fullName: labelForMonth(i + 1),
    shortName: labelForMonth(i + 1).slice(0, 1),
  }));

const generateDecadeRange = (decadesHistogram) => {
  const firstDecade = parseInt(decadesHistogram[0][0].slice(0, 4));
  const lastDecade = parseInt(
    decadesHistogram[decadesHistogram.length - 1][0].slice(0, 4),
  );

  const decades = [];
  let currentDecade = firstDecade;
  while (currentDecade <= lastDecade) {
    const label = `${currentDecade}s`;
    decades.push({ fullName: label, shortName: label.slice(2, 5) });
    currentDecade += 10;
  }

  return decades;
};

const compareMovies = (m1, m2, posterSort) => {
  console.log(m1);
  switch (posterSort) {
    case 'runtime':
      return m1.runtime - m2.runtime;
    case 'average-rating':
      return m1.averageVote - m2.averageVote;
    case 'num-ratings':
      return m1.voteCount - m2.voteCount;
    case 'release-date':
      return new Date(m1.releaseDate) - new Date(m2.releaseDate);
    case 'watch-date':
    default:
      return new Date(m1.watchDate) - new Date(m2.watchDate);
  }
};

const Home = ({ movieData }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [posterSort, setPosterSort] = useState('watch-date');
  const [posterSortAscending, setPosterSortAscending] = useState(true);

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
      [
        ...(selectedFilter
          ? filterMovies(movieData, selectedFilter)
          : movieData),
      ].sort(
        (m1, m2) =>
          (posterSortAscending ? 1 : -1) * compareMovies(m1, m2, posterSort),
      ),
    [movieData, selectedFilter, posterSort, posterSortAscending],
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
          <Histogram
            items={decadesHistogram}
            orderedGroups={generateDecadeRange(decadesHistogram)}
            onClickItem={(itemName) => setSelectedFilter({ decade: itemName })}
          />
        </MetricSection>
        <MetricSection
          metricName={'\uD83C\uDF9F\uFE0F Movies Watched by Month'}
        >
          <Histogram
            items={monthsHistogram}
            orderedGroups={generateMonths()}
            onClickItem={(itemName) => setSelectedFilter({ month: itemName })}
          />
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
          <div>
            <span>{currentTitle}</span>{' '}
            {selectedFilter && (
              <button
                className={styles.clear}
                onClick={() => setSelectedFilter(null)}
              >
                Clear
              </button>
            )}
          </div>
          <div>
            <label>
              Sort:{' '}
              <select
                id="poster-sort"
                value={posterSort}
                onChange={(e) => setPosterSort(e.target.value)}
              >
                <option value="watch-date">Watch Date</option>
                <option value="release-date">Release Date</option>
                <option value="average-rating">Average Rating</option>
                <option value="num-ratings">Number of Ratings</option>
                <option value="runtime">Runtime</option>
              </select>
            </label>{' '}
            <span>
              <button
                className={classNames(styles.toggleOrder, {
                  [styles.toggleOrderDesc]: !posterSortAscending,
                  [styles.toggleOrderAsc]: posterSortAscending,
                })}
                onClick={() => setPosterSortAscending(!posterSortAscending)}
              >
                &uarr;
              </button>
            </span>
          </div>
        </div>
        <PostersGrid movies={filteredMovies} />
      </div>
    </div>
  );
};

export default Home;
