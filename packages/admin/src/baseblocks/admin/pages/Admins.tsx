import React, { useState } from 'react';
import { Admin } from '@baseline/types/admin';
import PageContent from '../../../components/page-content/PageContent';
import AdminList from '../components/admin-list/AdminList';
import { AdminContext } from '../components/util/AdminContext';

const Admins = (): JSX.Element => {
  const [allAdmins, setAllAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(undefined);

  return (
    <PageContent
      isLoading={isLoading}
      hasStartedLoading={isLoading !== undefined}
    >
      {/** @TODO convert to props instead of context */}
      <AdminContext.Provider value={{ allAdmins, setAllAdmins }}>
        <AdminList setIsLoading={setIsLoading} />
      </AdminContext.Provider>
    </PageContent>
  );
};

export default Admins;
