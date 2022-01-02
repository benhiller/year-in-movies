import { useMemo, useState, useRef } from 'react';
import useMeasure from 'react-use-measure';
import mergeRefs from 'react-merge-refs';
import classNames from 'classnames';
import useMediaQuery from 'useMediaQuery';

import styles from 'styles/App.module.css';
import useWindowSize from 'useWindowSize';
import MetricSection from 'components/MetricSection';
import RankedMetric from 'components/RankedMetric';
import PostersGridControls from 'components/PostersGridControls';
import PostersGrid from 'components/PostersGrid';
import Histogram from 'components/Histogram';
import SummaryStats from 'components/SummaryStats';
import Footer from 'components/Footer';
import { filterMovies, filterMoviesForYear } from 'filters';
import { emojiForGenre } from 'genre';
import { emojiForLanguage } from 'language';
import {
  computeTopDirectors,
  computeTopCastMembers,
  computeTopGenres,
  computeTopLanguages,
  computeDecadesHistogram,
  computeMonthsHistogram,
  computeTimeSpent,
  computeLongestMovie,
  computeShortestMovie,
  computeLeastRatedMovie,
  computeMostRatedMovie,
  computeFirstMovie,
  computeLastMovie,
  labelForMonth,
} from 'metrics';
import { ReactComponent as Arrow } from 'img/arrow.svg';

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
  const desktopMode = useMediaQuery('(min-width: 850px)');
  const [selectedYear, setSelectedYear] = useState(
    Math.max(2019, Math.min(2022, new Date().getFullYear())),
  );
  const [selectedFilter, setSelectedFilter] = useState(null);
  const allowsExpandedPosters = !desktopMode;
  const [expandedPosters, setExpandedPosters] = useState(false);
  const [posterSort, setPosterSort] = useState('watch-date');
  const [posterSortAscending, setPosterSortAscending] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const postersContainerRef = useRef(null);
  const contentRef = useRef(null);
  const [measureRef, { height: postersContainerHeight }] = useMeasure({
    debounce: 64,
    polyfill: ResizeObserver,
  });
  const mergedRef = mergeRefs([measureRef, postersContainerRef]);

  const movieDataForYear = useMemo(
    () => filterMoviesForYear(movieData, selectedYear),
    [movieData, selectedYear],
  );

  const {
    topDirectors,
    topCastMembers,
    topGenres,
    topLanguages,
    decadesHistogram,
    monthsHistogram,
    timeSpent,
    longestMovie,
    shortestMovie,
    leastRatedMovie,
    mostRatedMovie,
    firstMovie,
    lastMovie,
  } = useMemo(
    () => ({
      topDirectors: computeTopDirectors(movieDataForYear),
      topCastMembers: computeTopCastMembers(movieDataForYear),
      topGenres: computeTopGenres(movieDataForYear),
      topLanguages: computeTopLanguages(movieDataForYear),
      decadesHistogram: computeDecadesHistogram(movieDataForYear),
      monthsHistogram: computeMonthsHistogram(movieDataForYear),
      timeSpent: computeTimeSpent(movieDataForYear),
      longestMovie: computeLongestMovie(movieDataForYear),
      shortestMovie: computeShortestMovie(movieDataForYear),
      leastRatedMovie: computeLeastRatedMovie(movieDataForYear),
      mostRatedMovie: computeMostRatedMovie(movieDataForYear),
      firstMovie: computeFirstMovie(movieDataForYear),
      lastMovie: computeLastMovie(movieDataForYear),
    }),
    [movieDataForYear],
  );

  const movieCount = movieDataForYear.length;

  const filteredMovies = useMemo(
    () =>
      [
        ...(selectedFilter
          ? filterMovies(movieDataForYear, selectedFilter)
          : movieDataForYear),
      ].sort(
        (m1, m2) =>
          (posterSortAscending ? 1 : -1) * compareMovies(m1, m2, posterSort),
      ),
    [movieDataForYear, selectedFilter, posterSort, posterSortAscending],
  );

  return (
    <div
      className={styles.container}
      style={
        height ? { height: `${height}px`, minHeight: `${height}px` } : null
      }
    >
      <div
        className={classNames(styles.content, {
          [styles.collapsedContent]: allowsExpandedPosters && expandedPosters,
        })}
        ref={contentRef}
      >
        <h1 className={styles.title}>
          <button
            disabled={selectedYear === 2019}
            className={classNames(styles.previousButton, {
              [styles.hidden]: selectedYear === 2019,
            })}
            onClick={() => setSelectedYear(selectedYear - 1)}
          >
            <Arrow />
          </button>

          <div>
            Ben&apos;s Year in Movies -{' '}
            <span className={styles.year}>{selectedYear}</span>
          </div>
          <button
            disabled={selectedYear === 2022}
            className={classNames(styles.nextButton, {
              [styles.hidden]: selectedYear === 2022,
            })}
            onClick={() => setSelectedYear(selectedYear + 1)}
          >
            <Arrow />
          </button>
        </h1>
        <div className={styles.section}>
          <SummaryStats
            stats={[
              { statName: 'Movies Watched', statValue: movieCount },
              {
                statName: 'Spent Watching Movies',
                statValue: `${Math.floor(timeSpent / 1440)}d ${Math.floor(
                  (timeSpent % 1440) / 60,
                )}h ${timeSpent % 60}m`,
              },
            ]}
          />
        </div>
        <div className={styles.section}>
          <SummaryStats
            stats={[
              {
                statName: `First Movie of ${selectedYear}`,
                statValue: firstMovie.title,
              },
              {
                statName: `Last Movie of ${selectedYear}`,
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
            items={topGenres.map(([genre, count]) => ({
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
            items={topDirectors
              .filter(({ count }) => count > 1)
              .map(({ director, count }) => ({
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
            items={topCastMembers
              .filter(({ count }) => count > 1)
              .map(({ castMember, count }) => ({
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
          emoji={'\uD83C\uDF0E'}
          metricName="Top Languages"
        >
          <RankedMetric
            items={topLanguages.map(([language, count]) => ({
              count,
              name: language,
              emoji: emojiForLanguage(language),
              selected: selectedFilter?.language === language,
            }))}
            onClickItem={(itemName) => {
              selectedFilter?.language === itemName
                ? setSelectedFilter(null)
                : setSelectedFilter({ language: itemName });
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
                statDetailLabel: `${leastRatedMovie.voteCount} ratings on TMDb`,
              },
              {
                statValue: 'Least Obscure',
                statName: mostRatedMovie.title,
                statDetailLabel: `${mostRatedMovie.voteCount} ratings on TMDb`,
              },
            ]}
            onClickStat={(idx) => {
              setPosterSort('num-ratings');
              setPosterSortAscending(idx === 0);
            }}
          />
        </div>
        <Footer />
      </div>
      <div
        className={styles.postersContainer}
        ref={mergedRef}
        onScroll={() => {
          setScrollTop(postersContainerRef.current.scrollTop);
        }}
      >
        <PostersGridControls
          selectedFilter={selectedFilter}
          posterSort={posterSort}
          posterSortAscending={posterSortAscending}
          allowsExpansion={allowsExpandedPosters}
          expanded={allowsExpandedPosters && expandedPosters}
          onExpandOrCollapse={() => {
            setExpandedPosters(!expandedPosters);
            contentRef.current.scrollTop = 0;
          }}
          onChangeFilter={setSelectedFilter}
          onChangePosterSort={setPosterSort}
          onChangePosterSortAscending={setPosterSortAscending}
        />
        <PostersGrid
          movies={filteredMovies}
          scrollTop={scrollTop}
          height={postersContainerHeight}
        />
      </div>
    </div>
  );
};

export default Home;
