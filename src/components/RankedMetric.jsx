import styles from 'styles/RankedMetric.module.css';

const separateNameTokens = (name) => {
  const tokens = name.split(' ');

  const finalToken = tokens[tokens.length - 1];
  const hasJrOrSr = finalToken === 'Jr.' || finalToken === 'Sr.';
  const finalPart = tokens.slice(
    tokens.length - (hasJrOrSr ? 2 : 1),
    tokens.length,
  );
  const initialPart = tokens.slice(0, tokens.length - (hasJrOrSr ? 2 : 1));

  // Return separate items for first/last name
  return initialPart.length
    ? [initialPart.join(' '), finalPart.join(' ')]
    : [null, finalPart.join(' ')];
};

const RankedMetric = ({ items, onClickItem }) => {
  return (
    <ol className={styles.rankedList}>
      {items.map(({ name, imageSrc, emoji, count, selected }) => {
        const [initialPart, finalPart] = separateNameTokens(name);
        return (
          <li key={name} className={selected ? styles.selected : null}>
            <button onClick={() => onClickItem(name)}>
              <div className={styles.pic}>
                <span className={styles.position}>{count}</span>
                {imageSrc ? (
                  <img width={80} height={80} src={imageSrc} alt={name} />
                ) : emoji ? (
                  <div className={styles.genreEmoji}>{emoji}</div>
                ) : (
                  <div className={styles.directorPlaceholder}>?</div>
                )}
              </div>
              <span className={styles.name}>
                {initialPart ? (
                  <span>
                    {initialPart + '\n '}
                    <span className={styles.lastName}>{finalPart}</span>
                  </span>
                ) : (
                  <span className={styles.lastName}>{finalPart}</span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

export default RankedMetric;
