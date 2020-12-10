import styles from 'styles/Histogram.module.css';

const Histogram = ({ items, orderedGroups, onClickItem }) => {
  const countByGroup = Object.fromEntries(items);
  const maxCount = items.reduce((acc, [_, count]) => Math.max(acc, count), 0);

  return (
    <div className={styles.histogram}>
      {orderedGroups.map(({ fullName, shortName }) => (
        <button key={fullName} onClick={() => onClickItem(fullName)}>
          <span className={styles.count}>{countByGroup[fullName] || '0'}</span>
          <div
            style={{ height: `${(countByGroup[fullName] / maxCount) * 100}px` }}
          ></div>
          <span className={styles.label}>{shortName}</span>
        </button>
      ))}
    </div>
  );
};

export default Histogram;
