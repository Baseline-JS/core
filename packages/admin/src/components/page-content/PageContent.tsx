import React from 'react';
import Loader from './loader/Loader';
import styles from './PageContent.module.scss';

interface Props {
  isLoading?: boolean;
  hasStartedLoading?: boolean;
  children: JSX.Element | JSX.Element[];
}

const PageContent = (props: Props) => {
  const { isLoading, hasStartedLoading, children } = props;

  return (
    <div className={styles.pageContent}>
      <Loader isLoading={isLoading} hasStartedLoading={hasStartedLoading} />
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default PageContent;
