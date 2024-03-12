import React from 'react';
import styles from './DashboardContent.module.scss';

const DashboardContent = (): JSX.Element => {
  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <div className={styles.grid}>
        <div className={styles.preview}>
          <h2>My Site Preview</h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
