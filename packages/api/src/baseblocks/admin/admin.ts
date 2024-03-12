import { Admin } from '@baseline/types/admin';

export const AdminMapper = (data: Admin): Admin => {
  const admin: Admin = {
    userSub: data?.userSub,
    userEmail: data?.userEmail,
  };
  return admin;
};
