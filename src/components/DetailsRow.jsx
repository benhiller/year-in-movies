import { useSpring, a } from 'react-spring';

import styles from 'styles/DetailsRow.module.css';
import { ReactComponent as Chevron } from 'img/detail-row-chevron.svg';
import { labelForLanguage } from 'language';

const DetailsRow = ({ movie, chevronPosition }) => {
  const props = useSpring({ left: chevronPosition });
  const releaseYear = movie.releaseDate.slice(0, 4);
  return (
    <div className={styles.container}>
      <a.div className={styles.chevron} style={props}>
        <Chevron />
      </a.div>
      <div className={styles.row}>
        <div className={styles.title}>
          <b>{movie.title}</b> ({releaseYear})
        </div>
        <div className={styles.detailedStats}>
          <div>
            <p>
              <b>Director</b>: {movie.director.map((d) => d.name).join(', ')}
            </p>
            <p>
              <b>Cast</b>:{' '}
              {movie.cast
                .sort((c1, c2) => c1.position - c2.position)
                .map((c) => c.name)
                .join(', ')}
            </p>
            <p>
              <b>Genre</b>: {movie.genres.join(', ')}
            </p>
            <p>
              <b>Runtime</b>: {Math.floor(movie.runtime / 60)}h{' '}
              {movie.runtime % 60}m
            </p>
          </div>
          <div>
            <p>
              <b>Language</b>: {labelForLanguage(movie.language)}
            </p>
            <p>
              <b>Watched at</b>: {movie.source}
            </p>
            <p>
              <b>Watched on</b>: {movie.watchDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsRow;
