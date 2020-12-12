import { useMemo, useState } from 'react';

import styles from 'styles/App.module.css';
import useWindowSize from 'useWindowSize';
import MetricSection from 'components/MetricSection';
import RankedMetric from 'components/RankedMetric';
import PostersGridControls from 'components/PostersGridControls';
import PostersGrid from 'components/PostersGrid';
import Histogram from 'components/Histogram';
import SummaryStats from 'components/SummaryStats';
import Footer from 'components/Footer';
import { filterMovies } from 'filters';
import { emojiForGenre } from 'genre';
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
  computeFirstMovie,
  computeLastMovie,
  labelForMonth,
} from 'metrics';

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
  const { height } = useWindowSize();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [posterSort, setPosterSort] = useState('watch-date');
  const [posterSortAscending, setPosterSortAscending] = useState(true);

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
    firstMovie,
    lastMovie,
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
      firstMovie: computeFirstMovie(movieData),
      lastMovie: computeLastMovie(movieData),
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

  return (
    <div
      className={styles.container}
      style={
        height ? { height: `${height}px`, minHeight: `${height}px` } : null
      }
    >
      <div className={styles.content}>
        <h1>
          Ben&apos;s Year in Movies - <span className={styles.year}>2020</span>
        </h1>
        <div className={styles.section}>
          <SummaryStats
            stats={[
              { statName: 'Movies Watched', statValue: movieCount },
              {
                statName: 'Spent Watching Movies',
                statValue: `${Math.floor(timeSpent / 60)}h ${timeSpent % 60}m`,
              },
            ]}
          />
        </div>
        <div className={styles.section}>
          <SummaryStats
            stats={[
              {
                statName: 'First Movie of 2020',
                statValue: firstMovie.title,
              },
              {
                statName: 'Last Movie of 2020',
                statValue: lastMovie.title,
              },
            ]}
            onClickStat={(idx) => {
              setPosterSort('watch-data');
              setPosterSortAscending(idx === 0);
            }}
          />
        </div>
        <MetricSection
          className={styles.section}
          emoji={'\uD83C\uDF9E\uFE0F'}
          metricName="Most Watched Genres"
        >
          <RankedMetric
            items={topGenres.slice(0, 15).map(([genre, count]) => ({
              count,
              name: genre,
              emoji: emojiForGenre(genre),
              selected: selectedFilter?.genre === genre,
            }))}
            onClickItem={(itemName) => {
              selectedFilter?.genre === itemName
                ? setSelectedFilter(null)
                : setSelectedFilter({ genre: itemName });
            }}
          />
        </MetricSection>
        <MetricSection
          className={styles.section}
          emoji={'\uD83C\uDFAC'}
          metricName="Most Watched Directors"
        >
          <RankedMetric
            items={topDirectors.slice(0, 15).map(({ director, count }) => ({
              count,
              name: director.name,
              imageSrc: director.imageSrc
                ? `https://image.tmdb.org/t/p/w180_and_h180_face${director.imageSrc}`
                : null,
              selected: selectedFilter?.director === director.name,
            }))}
            onClickItem={(itemName) => {
              selectedFilter?.director === itemName
                ? setSelectedFilter(null)
                : setSelectedFilter({ director: itemName });
            }}
          />
        </MetricSection>
        <MetricSection
          emoji={'\uD83C\uDFC6'}
          metricName="Most Watched Actors"
          className={styles.section}
        >
          <RankedMetric
            items={topCastMembers.slice(0, 15).map(({ castMember, count }) => ({
              count,
              name: castMember.name,
              imageSrc: castMember.imageSrc
                ? `https://image.tmdb.org/t/p/w180_and_h180_face${castMember.imageSrc}`
                : null,
              selected: selectedFilter?.castMember === castMember.name,
            }))}
            onClickItem={(itemName) => {
              selectedFilter?.castMember === itemName
                ? setSelectedFilter(null)
                : setSelectedFilter({ castMember: itemName });
            }}
          />
        </MetricSection>
        <MetricSection
          className={styles.section}
          emoji={'\uD83D\uDDD3\uFE0F'}
          metricName="Movies Watched by Decade"
        >
          <Histogram
            items={decadesHistogram}
            orderedGroups={generateDecadeRange(decadesHistogram).map(
              (decade) => ({
                ...decade,
                selected: selectedFilter?.decade === decade.fullName,
              }),
            )}
            onClickItem={(itemName) =>
              selectedFilter?.decade === itemName
                ? setSelectedFilter(null)
                : setSelectedFilter({ decade: itemName })
            }
          />
        </MetricSection>
        <MetricSection
          className={styles.section}
          emoji={'\uD83C\uDF9F\uFE0F'}
          metricName="Movies Watched by Month"
        >
          <Histogram
            items={monthsHistogram}
            orderedGroups={generateMonths().map((month) => ({
              ...month,
              selected: selectedFilter?.month === month.fullName,
            }))}
            onClickItem={(itemName) =>
              selectedFilter?.month === itemName
                ? setSelectedFilter(null)
                : setSelectedFilter({ month: itemName })
            }
          />
        </MetricSection>
        <div className={styles.separator} />
        <div className={styles.section}>
          <SummaryStats
            stats={[
              {
                statValue: 'Longest Movie',
                statName: longestMovie.title,
                statDetailLabel: `${Math.floor(longestMovie.runtime / 60)}h ${
                  longestMovie.runtime % 60
                }m`,
              },
              {
                statValue: 'Shortest Movie',
                statName: shortestMovie.title,
                statDetailLabel: `${Math.floor(shortestMovie.runtime / 60)}h ${
                  shortestMovie.runtime % 60
                }m`,
              },
            ]}
            onClickStat={(idx) => {
              setPosterSort('runtime');
              setPosterSortAscending(idx === 1);
            }}
          />
        </div>
        <div className={styles.section}>
          <SummaryStats
            stats={[
              {
                statValue: 'Most Obscure',
                statName: leastRatedMovie.title,
                statDetailLabel: `${leastRatedMovie.voteCount} ratings`,
              },
              {
                statValue: 'Least Obscure',
                statName: mostRatedMovie.title,
                statDetailLabel: `${mostRatedMovie.voteCount} ratings`,
              },
            ]}
            onClickStat={(idx) => {
              setPosterSort('num-ratings');
              setPosterSortAscending(idx === 0);
            }}
          />
        </div>
        <div className={styles.section}>
          <SummaryStats
            stats={[
              {
                statValue: 'Lowest Rated',
                statName: lowestRatedMovie.title,
                statDetailLabel: `${lowestRatedMovie.averageVote} average rating`,
              },
              {
                statValue: 'Higest Rated',
                statName: highestRatedMovie.title,
                statDetailLabel: `${highestRatedMovie.averageVote} average rating`,
              },
            ]}
            onClickStat={(idx) => {
              setPosterSort('average-rating');
              setPosterSortAscending(idx === 0);
            }}
          />
        </div>
        <Footer />
      </div>
      <div className={styles.postersContainer}>
        <PostersGridControls
          selectedFilter={selectedFilter}
          posterSort={posterSort}
          posterSortAscending={posterSortAscending}
          onChangeFilter={setSelectedFilter}
          onChangePosterSort={setPosterSort}
          onChangePosterSortAscending={setPosterSortAscending}
        />
        <PostersGrid movies={filteredMovies} />
      </div>
    </div>
  );
};

export default Home;
