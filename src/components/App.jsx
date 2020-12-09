import { useMemo, useState } from 'react';

import styles from 'styles/App.module.css';
import MetricSection from 'components/MetricSection';
import RankedMetric from 'components/RankedMetric';
import PostersGrid from 'components/PostersGrid';
import Footer from 'components/Footer';

const monthFromDate = (date) => {
  const dateObj = new Date(date.slice(0, 4), parseInt(date.slice(5, 7)) - 1);
  return dateObj.toLocaleString('default', { month: 'long' });
};

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
        .map(([_, item]) => item),
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
        .map(([_, item]) => item),
    [movieData],
  );

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
  const topGenres = useMemo(
    () =>
      Object.entries(
        movieData.reduce((acc, movie) => {
          const { genres } = movie;
          if (!genres) {
            return acc;
          }

          genres.forEach((genre) => {
            if (acc[genre]) {
              acc[genre] = acc[genre] + 1;
            } else {
              acc[genre] = 1;
            }
          });
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
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

  const monthsHistogram = useMemo(
    () =>
      Object.entries(
        movieData.reduce((acc, movie) => {
          const month = monthFromDate(movie.watchDate);
          if (acc[month]) {
            acc[month] = acc[month] + 1;
          } else {
            acc[month] = 1;
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
        <MetricSection metricName={'\uD83C\uDFAD Most Watched Genres'}>
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
