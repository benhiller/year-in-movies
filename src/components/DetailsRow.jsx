import { useSpring, a } from 'react-spring';

import styles from 'styles/DetailsRow.module.css';

const DetailsRow = ({ movie, chevronPosition }) => {
  const props = useSpring({ left: chevronPosition });
  return (
    <div className={styles.container}>
      <a.div className={styles.chevron} style={props} />
      <div className={styles.row}>
        <b>{movie.title}</b>
      </div>
    </div>
  );
};

export default DetailsRow;
