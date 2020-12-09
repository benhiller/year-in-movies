import styles from 'styles/RankedMetric.module.css';

const RankedMetric = ({ items, onClickItem }) => {
  return (
    <ol className={styles.rankedList}>
      {items.map(({ name, imageSrc, emoji, count }) => (
        <li key={name}>
          <button onClick={() => onClickItem(name)}>
            <div className={styles.pic}>
              <span className={styles.position}>{count}</span>
              {imageSrc ? (
                <img src={imageSrc} alt={name} />
              ) : emoji ? (
                <div className={styles.genreEmoji}>{emoji}</div>
              ) : (
                <div className={styles.directorPlaceholder} />
              )}
            </div>
            <span>{name}</span>
          </button>
        </li>
      ))}
    </ol>
  );
};

export default RankedMetric;
