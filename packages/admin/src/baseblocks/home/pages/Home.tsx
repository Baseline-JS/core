import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <h1>Home</h1>
        <p>Welcome to the home page</p>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
export default Home;
