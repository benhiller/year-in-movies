import styles from 'styles/Histogram.module.css';

const Histogram = ({ items, orderedGroups, onClickItem }) => {
  const countByGroup = Object.fromEntries(items);
  const maxCount = items.reduce((acc, [_, count]) => Math.max(acc, count), 0);

  return (
    <div className={styles.histogram}>
      {orderedGroups.map((group) => (
        <button key={group} onClick={() => onClickItem(group)}>
          <div
            style={{ height: `${(countByGroup[group] / maxCount) * 100}px` }}
          ></div>
        </button>
      ))}
    </div>
  );
};

export default Histogram;
