import { useSpring, a } from 'react-spring';

import styles from 'styles/DetailsRow.module.css';
import { ReactComponent as Chevron } from 'img/detail-row-chevron.svg';

const DetailsRow = ({ movie, chevronPosition }) => {
  const props = useSpring({ left: chevronPosition });
  return (
    <div className={styles.container}>
      <a.div className={styles.chevron} style={props}>
        <Chevron />
      </a.div>
      <div className={styles.row}>
        <b>{movie.title}</b>
      </div>
    </div>
  );
};

export default DetailsRow;
