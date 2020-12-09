import styles from 'styles/MetricSection.module.css';

const MetricSection = ({ metricName, children }) => {
  return (
    <div>
      <span className={styles.sectionTitle}>{metricName}</span>
      {children}
    </div>
  );
};

export default MetricSection;
