import React from 'react';
import { Admin } from '@baseline/types/admin';
import AdminList from '../components/admin-list/AdminList';
import { useLoaderData } from 'react-router-dom';
import { getAllAdmins } from '@baseline/client-api/admin';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import PageContent from '../../../components/page-content/PageContent';

export async function adminListLoader() {
  const admins = await getAllAdmins(getRequestHandler());
  return {
    admins: admins,
  };
}

const Admins = (): JSX.Element => {
  const { admins } = useLoaderData() as { admins: Admin[] };

  return (
    <PageContent>
      <AdminList admins={admins} />
    </PageContent>
  );
};

export default Admins;
