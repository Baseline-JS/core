import React from 'react';
import styles from './PageContent.module.scss';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const PageContent = (props: Props) => {
  const { children } = props;

  return (
    <>
      <div className={styles.pageContent}>
        <div className={styles.children}>{children}</div>
      </div>
    </>
  );
};

export default PageContent;
