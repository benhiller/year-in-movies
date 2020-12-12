import styles from 'styles/MetricSection.module.css';

const MetricSection = ({ emoji, metricName, children, ...props }) => {
  return (
    <div className={styles.metricContainer} {...props}>
      <div className={styles.titleContainer}>
        <span className={styles.sectionEmoji}>{emoji}</span>
        <span className={styles.sectionTitle}>{metricName}</span>
        <div className={styles.rule} />
      </div>
      {children}
    </div>
  );
};

export default MetricSection;
