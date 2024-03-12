import { createContext, Dispatch, SetStateAction } from 'react';
import { Admin } from '@baseline/types/admin';

export const AdminContext = createContext<{
  allAdmins: Admin[];
  setAllAdmins: Dispatch<SetStateAction<Admin[]>>;
}>({
  allAdmins: undefined,
  setAllAdmins: undefined,
});
