import styles from 'styles/SummaryStats.module.css';

const SummaryStats = ({ stats, onClickStat }) => {
  return (
    <div className={styles.summaryStats}>
      {stats.map(({ statName, statValue, statDetailLabel }, idx) => (
        <div
          key={statName}
          className={onClickStat ? styles.summaryStatButton : null}
          onClick={() => onClickStat && onClickStat(idx)}
        >
          <div className={styles.summaryValue}>{statValue}</div>
          <div className={styles.summaryStat}>{statName}</div>
          {statDetailLabel && (
            <div className={styles.summaryDetail}>{statDetailLabel}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryStats;
