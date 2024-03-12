import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = (): JSX.Element => (
  <div className={styles.footer}>
    <div className={styles.column}>
      <img src="/logo-white.svg" alt="logo" />
      <div className={styles.links}>
        <Link to="/about">About</Link>
      </div>
      <div className={styles.address}>
        Business Address
        <br />
        Smith Street
        <br />
        1234 5678
      </div>
    </div>
    <div className={styles.column}>{/* Column for mailing list */}</div>
  </div>
);

export default Footer;
