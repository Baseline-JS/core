import React, { useState } from 'react';
import PageContent from '../../../components/page-content/PageContent';
import UserSettings from '../components/user-settings/UserSettings';

const User = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(undefined);

  return (
    <PageContent
      isLoading={isLoading}
      hasStartedLoading={isLoading !== undefined}
    >
      <UserSettings setIsLoading={setIsLoading} />
    </PageContent>
  );
};

export default User;
