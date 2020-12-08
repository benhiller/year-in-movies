import { useMemo } from 'react';
import useMeasure from 'react-use-measure';
import { useTransition, a, interpolate } from 'react-spring';

import styles from './styles/PostersGrid.module.css';

const POSTER_WIDTH = 100;
const POSTER_HEIGHT = 150;
// TODO - this is really min. spacing. maybe there should also be max spacing and to fit to a value in between the two the posters will resize?
const POSTER_SPACING = 10;

const PostersGrid = ({ movies }) => {
  const [ref, bounds] = useMeasure({ debounce: 64 });
  const { width: w } = bounds;
  // necessary so xy values don't get all messed up on initial render
  const width = w || 600;
  // TODO - don't render until w is defined

  // TODO - cleanup
  let columns = 1;
  while (columns * POSTER_WIDTH + (columns - 1) * POSTER_SPACING < width) {
    columns += 1;
  }
  columns--;

  const actualSpacing = (width - POSTER_WIDTH * columns) / (columns - 1);

  const gridItems = useMemo(() => {
    return movies.map((child, i) => {
      const column = i % columns;
      const xy = [
        POSTER_WIDTH * column + Math.max(0, actualSpacing * column),
        POSTER_HEIGHT * Math.floor(i / columns) +
          Math.max(0, POSTER_SPACING * Math.floor(i / columns)),
      ];
      return { ...child, xy, width: POSTER_WIDTH, height: POSTER_HEIGHT };
    });
  }, [columns, movies, actualSpacing]);

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
    config: { mass: 1, tension: 195, friction: 18 },
  });

  const height =
    Math.ceil(movies.length / columns) * POSTER_HEIGHT +
    (Math.ceil(movies.length / columns) - 1) * POSTER_SPACING;

  return (
    <div className={styles.posters} ref={ref} style={{ height: `${height}px` }}>
      {transitions.map(({ item, props: { xy, scale, ...rest }, key }) => {
        return (
          <a.img
            key={key}
            style={{
              transform: interpolate([xy, scale], ([x, y], scale) => {
                return `translate3d(${x}px,${y}px,0) scale(${scale})`;
              }),
              ...rest,
            }}
            src={`https://image.tmdb.org/t/p/w342${item.posterSrc}`}
            alt={item.title}
          />
        );
      })}
    </div>
  );
};

export default PostersGrid;
