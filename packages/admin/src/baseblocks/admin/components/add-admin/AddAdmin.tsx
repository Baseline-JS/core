import { createAdmin } from '@baseline/client-api/admin';
import React, { useContext, useState } from 'react';
import {
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import { AdminContext } from '../util/AdminContext';
import styles from './AddAdmin.module.scss';

const AddAdmin = () => {
  const { setAllAdmins } = useContext(AdminContext);

  const [newEmail, setNewEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggle = () => {
    setNewEmail('');
    setIsModalOpen((open) => !open);
  };

  const addUser = async (): Promise<void> => {
    const newAdmin = await createAdmin(getRequestHandler(), {
      userEmail: newEmail,
    });
    setAllAdmins((admins) => [...admins, newAdmin]);
    toggle();
  };

  return (
    <div className={styles.addUser}>
      <button className={styles.addUserButton} onClick={toggle}>
        Invite
      </button>
      <Modal
        className={styles.addUserModal}
        isOpen={isModalOpen}
        toggle={toggle}
        centered
      >
        <ModalHeader toggle={toggle}>Add Admin</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Email</Label>
            <Input
              onChange={(e) => setNewEmail(e.target.value)}
              value={newEmail}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <button
            disabled={!newEmail}
            className={styles.addUserButton}
            onClick={() => {
              void addUser();
            }}
          >
            Add
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddAdmin;
