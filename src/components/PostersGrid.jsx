import { useMemo, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import { useTransition, a, interpolate } from 'react-spring';
import { ResizeObserver } from '@juggle/resize-observer';

import styles from 'styles/PostersGrid.module.css';
import DetailsRow from 'components/DetailsRow';
import useMediaQuery from 'useMediaQuery';

const POSTER_MIN_WIDTH = 120;
const POSTER_MIN_WIDTH_MOBILE = 90;
const POSTER_HEIGHT_MULTIPLIER = 1.5;
const POSTER_SPACING = 15;
const POSTER_SPACING_MOBILE = 10;
const MOBILE_WIDTH_THRESHOLD = 500;
const DETAILS_SECTION_HEIGHT = 100;

// include the row in the details row key so that we don't animate this moving
// from one row to another
const itemKey = (item) =>
  item.detailsRow
    ? `details-row-${item.detailsRow}`
    : `${item.title}-${item.watchDate}`;

const PostersGrid = ({ width, movies }) => {
  const ref = useRef();
  const desktopMode = useMediaQuery('(min-width: 850px)');
  const [selectedPoster, setSelectedPoster] = useState(null);

  const posterMinWidth =
    width > MOBILE_WIDTH_THRESHOLD ? POSTER_MIN_WIDTH : POSTER_MIN_WIDTH_MOBILE;
  const posterSpacing =
    width > MOBILE_WIDTH_THRESHOLD ? POSTER_SPACING : POSTER_SPACING_MOBILE;

  // TODO - There should be a way to compute this without the while loop
  let columns = 1;
  while (columns * posterMinWidth + (columns - 1) * posterSpacing < width) {
    columns += 1;
  }
  columns--;
  const posterWidth = (width - posterSpacing * (columns - 1)) / columns;
  const posterHeight = posterWidth * POSTER_HEIGHT_MULTIPLIER;
  const selectedItemIndex = selectedPoster
    ? movies.findIndex((movie) => itemKey(movie) === selectedPoster)
    : null;

  const gridItems = useMemo(() => {
    const detailsColumn =
      selectedItemIndex !== null ? selectedItemIndex % columns : null;
    const detailsRow =
      selectedItemIndex !== null
        ? Math.floor(selectedItemIndex / columns) + 1
        : null;

    const items = movies.map((child, i) => {
      const column = i % columns;
      const row = Math.floor(i / columns);
      const xy = [
        posterWidth * column + posterSpacing * column,
        posterHeight * Math.floor(i / columns) +
          posterSpacing * Math.floor(i / columns) +
          (selectedItemIndex !== null && row >= detailsRow
            ? DETAILS_SECTION_HEIGHT
            : 0),
      ];
      return {
        ...child,
        xy,
        width: posterWidth,
        height: posterHeight,
      };
    });
    if (selectedItemIndex !== null) {
      items.push({
        detailsRow: detailsRow,
        movie: movies[selectedItemIndex],
        xy: [0, posterHeight * detailsRow + posterSpacing * (detailsRow - 1)],
        width: desktopMode ? width + 50 : width + 20,
        height: DETAILS_SECTION_HEIGHT,
        chevronPosition:
          (desktopMode ? 25 : 10) +
          detailsColumn * posterWidth +
          posterSpacing * detailsColumn +
          posterWidth / 2 -
          19 / 2, // take the size of the chevron into account
      });
    }

    return items;
  }, [
    columns,
    movies,
    width,
    posterWidth,
    posterHeight,
    posterSpacing,
    selectedItemIndex,
    desktopMode,
  ]);

  const transitions = useTransition(gridItems, itemKey, {
    from: ({ xy, width, height }) => ({
      xy,
      width,
      height,
      opacity: 0,
      scale: 0.25,
    }),
    enter: ({ xy, width, height }) => ({
      xy,
      width,
      height,
      opacity: 1,
      scale: 1,
    }),
    update: ({ xy, width, height }) => ({ xy, width, height }),
    leave: { opacity: 0, scale: 0.25 },
    config: { mass: 1, tension: 195, friction: 22 },
    // Disable animation on initial render
    immediate: !ref.current,
  });

  const height =
    Math.ceil(movies.length / columns) * posterHeight +
    (Math.ceil(movies.length / columns) - 1) * posterSpacing +
    (selectedItemIndex !== null ? DETAILS_SECTION_HEIGHT : 0);

  return (
    <div className={styles.posters} ref={ref} style={{ height: `${height}px` }}>
      {transitions.map(({ item, props: { xy, scale, ...rest }, key }) => {
        if (item.detailsRow) {
          return (
            <a.div
              key={key}
              className={styles.detailsRow}
              style={{
                transform: interpolate([xy, scale], ([x, y], scale) => {
                  return `translate3d(${x}px,${y}px,0) scaleY(${scale})`;
                }),
                ...rest,
              }}
            >
              <DetailsRow
                chevronPosition={item.chevronPosition}
                movie={item.movie}
              />
            </a.div>
          );
        } else {
          return (
            <a.a
              key={key}
              className={styles.posterImage}
              onClick={() =>
                selectedPoster === itemKey(item)
                  ? setSelectedPoster(null)
                  : setSelectedPoster(itemKey(item))
              }
              style={{
                transform: interpolate([xy, scale], ([x, y], scale) => {
                  return `translate3d(${x}px,${y}px,0) scale(${scale})`;
                }),
                ...rest,
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w342${item.posterSrc}`}
                alt={item.title}
                width={posterWidth}
                height={posterHeight}
              />
              {/* This div shows a nice little border on top of the poster image */}
              <div />
            </a.a>
          );
        }
      })}
    </div>
  );
};

// Used to ensure PostersGrid does not render until we know the width it will be rendered at
const PostersGridWrapper = (props) => {
  const [ref, { width }] = useMeasure({
    debounce: 64,
    polyfill: ResizeObserver,
  });

  return (
    <div ref={ref} className={styles.wrapper}>
      {!!width && <PostersGrid width={width} {...props} />}
    </div>
  );
};

export default PostersGridWrapper;
