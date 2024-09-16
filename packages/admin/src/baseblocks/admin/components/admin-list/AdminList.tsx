import React, { useState } from 'react';
import { deleteAdmin } from '@baseline/client-api/admin';
import ConfirmDelete from '../../../../components/confirm-delete/ConfirmDelete';
import AddUser from '../add-admin/AddAdmin';
import styles from './AdminList.module.scss';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import { Admin } from '@baseline/types/admin';

interface Props {
  admins: Admin[];
}

const AdminList = (props: Props): JSX.Element => {
  const [allAdmins, setAllAdmins] = useState<Admin[]>(props?.admins || []);

  const handleDelete = async (adminSub: string): Promise<void> => {
    await deleteAdmin(getRequestHandler(), { adminId: adminSub });
    setAllAdmins((admins) =>
      admins.filter((admin) => admin.userSub !== adminSub),
    );
  };

  return (
    <div className={styles.userList}>
      <div className={styles.list}>
        <div className={styles.header}>
          <div className={styles.userCount}>
            There are {allAdmins.length} people in your team
          </div>
          <AddUser setAllAdmins={setAllAdmins} />
        </div>
        {allAdmins.map((admin) => (
          <div key={admin.userSub} className={styles.admin}>
            <div className={styles.info}>
              <div className={styles.details}>
                <div className={styles.name}>{admin.userEmail}</div>
                <div className={styles.data}>{admin.userSub}</div>
              </div>
              <div className={styles.pill}>Admin</div>
            </div>
            <div className={styles.buttons}>
              <ConfirmDelete
                itemName={admin.userEmail}
                deleteFunction={async () => {
                  await handleDelete(admin.userSub);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminList;
