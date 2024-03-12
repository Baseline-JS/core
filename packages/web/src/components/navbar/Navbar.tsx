import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import styles from './Navbar.module.scss';

interface Route {
  label: string;
  path: string;
  type: 'link' | 'button';
}

const leftRoutes: Route[] = [
  {
    label: 'About',
    path: '/about',
    type: 'link',
  },
];

const Navbar = (): JSX.Element => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <div className={styles.spacer} />
      <div className={styles.navbar}>
        <div className={styles.toggler}>
          <Link to="/" className={styles.logo}>
            <img src="/b-logo.png" alt="Baseline Core" />
          </Link>
          <div
            className={styles.hamburger}
            onClick={() => setIsMobileOpen((open) => !open)}
            onKeyDown={() => setIsMobileOpen((open) => !open)}
            tabIndex={0}
            role="button"
          >
            <div className={styles.line} />
            <div className={styles.line} />
            <div className={styles.line} />
          </div>
        </div>
        <div className={styles.links}>
          <div className={styles.left}>
            {leftRoutes.map((route) => (
              <Link
                className={route.type === 'link' ? styles.link : styles.button}
                to={route.path}
                key={`${route.label}-${route.path}`}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        <Collapse isOpen={isMobileOpen}>
          <div className={`${styles.mobile} ${styles.links}`}>
            {[...leftRoutes].map((route) => (
              <Link
                className={route.type === 'link' ? styles.link : styles.button}
                to={route.path}
                key={`mobile-${route.label}-${route.path}`}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default Navbar;
