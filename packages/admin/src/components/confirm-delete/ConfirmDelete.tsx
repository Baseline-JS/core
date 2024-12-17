import React, { useState } from 'react';
import {
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import styles from './ConfirmDelete.module.scss';

interface Props {
  itemName: string;
  deleteFunction(this: void): Promise<void>;
  deleteString?: string;
  buttonProps?: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
}

const ConfirmDelete = (props: Props): JSX.Element => {
  const {
    itemName,
    deleteFunction,
    deleteString = itemName,
    buttonProps,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggle = () => setIsModalOpen((open) => !open);
  const [deleteType, setDeleteType] = useState('');

  const handleDelete = async (): Promise<void> => {
    toggle();
    setDeleteType('');
    await deleteFunction();
  };

  return (
    <div className={styles.confirmDelete}>
      <button {...buttonProps} onClick={toggle} className={styles.deleteButton}>
        Delete
      </button>
      <Modal
        isOpen={isModalOpen}
        toggle={toggle}
        centered
        className={styles.deleteModal}
      >
        <ModalHeader toggle={toggle}>
          Delete &quot;{itemName}&quot;?
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="delete">
              Please type <b>{deleteString}</b> to confirm deletion
            </Label>
            <Input
              id="delete"
              name="delete"
              autoComplete="off"
              placeholder={deleteString}
              value={deleteType}
              onChange={(e) => {
                setDeleteType(e.target.value);
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <button
            disabled={deleteString !== deleteType}
            onClick={() => {
              void handleDelete();
            }}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ConfirmDelete;
