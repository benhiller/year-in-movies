import styles from '~/styles/Histogram.module.css';

const Histogram = ({ items, orderedGroups, onClickItem }) => {
  const countByGroup = Object.fromEntries(items);
  const maxCount = items.reduce((acc, [_, count]) => Math.max(acc, count), 0);

  return (
    <div className={styles.histogram}>
      {orderedGroups.map(({ fullName, shortName, selected }) => (
        <button
          key={fullName}
          className={selected ? styles.selected : null}
          onClick={() => onClickItem(fullName)}
        >
          <span className={styles.count}>{countByGroup[fullName] || '0'}</span>
          <div
            style={{
              height: `${((countByGroup[fullName] || 0) / maxCount) * 100}px`,
            }}
          ></div>
          <span className={styles.label}>{shortName}</span>
        </button>
      ))}
    </div>
  );
};

export default Histogram;
