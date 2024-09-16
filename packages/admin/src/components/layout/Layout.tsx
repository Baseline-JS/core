import React from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import PageContent from '../page-content/PageContent';
import Loader from '../page-content/loader/Loader';

const Layout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <>
      <Sidebar />
      {isLoading ? (
        <PageContent>
          <Loader hasStartedLoading={true} />
        </PageContent>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Layout;
