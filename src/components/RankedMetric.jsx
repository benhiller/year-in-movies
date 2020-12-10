import styles from 'styles/RankedMetric.module.css';

const formatName = (name) => {
  const tokens = name.split(' ');

  const finalToken = tokens[tokens.length - 1];
  const hasJrOrSr = finalToken === 'Jr.' || finalToken === 'Sr.';
  const finalPart = tokens.slice(
    tokens.length - (hasJrOrSr ? 2 : 1),
    tokens.length,
  );
  const initialPart = tokens.slice(0, tokens.length - (hasJrOrSr ? 2 : 1));

  // Ensure the last name is on a separate line
  return ((initialPart.length ? initialPart.join(' ') + '\n' : '') +
    finalPart.join(' '): '');
};

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
            <span className={styles.name}>{formatName(name)}</span>
          </button>
        </li>
      ))}
    </ol>
  );
};

export default RankedMetric;
