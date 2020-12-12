import { useMemo, useRef } from 'react';
import useMeasure from 'react-use-measure';
import { useTransition, a, interpolate } from 'react-spring';
import { ResizeObserver } from '@juggle/resize-observer';

import styles from 'styles/PostersGrid.module.css';

const POSTER_MIN_WIDTH = 120;
const POSTER_MIN_WIDTH_MOBILE = 90;
const POSTER_HEIGHT_MULTIPLIER = 1.5;
const POSTER_SPACING = 15;
const POSTER_SPACING_MOBILE = 10;

const PostersGrid = ({ width, movies }) => {
  const ref = useRef();

  const posterMinWidth =
    width > 375 ? POSTER_MIN_WIDTH : POSTER_MIN_WIDTH_MOBILE;
  const posterSpacing = width > 375 ? POSTER_SPACING : POSTER_SPACING_MOBILE;

  // TODO - There should be a way to compute this without the while loop
  let columns = 1;
  while (columns * posterMinWidth + (columns - 1) * posterSpacing < width) {
    columns += 1;
  }
  columns--;
  const posterWidth = (width - posterSpacing * (columns - 1)) / columns;
  const posterHeight = posterWidth * POSTER_HEIGHT_MULTIPLIER;

  const gridItems = useMemo(() => {
    return movies.map((child, i) => {
      const column = i % columns;
      const xy = [
        posterWidth * column + posterSpacing * column,
        posterHeight * Math.floor(i / columns) +
          posterSpacing * Math.floor(i / columns),
      ];
      return {
        ...child,
        xy,
        width: posterWidth,
        height: posterHeight,
      };
    });
  }, [columns, movies, posterWidth, posterHeight, posterSpacing]);

  const transitions = useTransition(gridItems, (item) => item.title, {
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
    (Math.ceil(movies.length / columns) - 1) * posterSpacing;

  return (
    <div className={styles.posters} ref={ref} style={{ height: `${height}px` }}>
      {transitions.map(({ item, props: { xy, scale, ...rest }, key }) => {
        return (
          <a.a
            href={`https://www.themoviedb.org/movie/${item.tmdbId}`}
            target="_blank"
            rel="noreferrer"
            key={key}
            className={styles.posterImage}
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
