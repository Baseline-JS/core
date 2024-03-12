import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutBanner.module.scss';

const AboutBanner = (): JSX.Element => (
  <div className={styles.aboutBanner}>
    <div className={styles.content}>
      <h1>About us</h1>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        Maecenas sapien massa, aliquet id lectus sed, vulputate molestie nunc.
      </p>
      <Link to="/#">Button</Link>
    </div>
    <div className={styles.image}>
      <img src="./placeholder.svg" alt="placeholder" />
    </div>
  </div>
);

export default AboutBanner;
