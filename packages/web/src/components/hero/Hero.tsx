import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.scss';

const Hero = (): JSX.Element => (
  <div className={styles.hero}>
    <div className={styles.content}>
      <h1>Lorem ipsum</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ut
        nulla risus. Ut euismod, sapien ut rhoncus venenatis, metus magna congue
        mi, sit amet efficitur augue purus vel mi. Suspendisse eu varius nisl.
        Maecenas sapien massa, aliquet id lectus sed, vulputate molestie nunc.
      </p>
      <Link to="/#">Button</Link>
    </div>
    <div className={styles.image}>
      <img src="./placeholder.svg" alt="placeholder" />
    </div>
  </div>
);

export default Hero;
