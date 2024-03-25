import React from 'react';
import styles from './NotAdmin.module.scss';
import { signOut } from 'aws-amplify/auth';
import { redirect } from 'react-router-dom';

async function signOutButton() {
  await signOut();
  redirect('/');
}

function NotAdmin() {
  return (
    <div className={styles.notAdmin}>
      <div className={styles.content}>
        <div>
          <h1>Please contact your system administrator</h1>
          <p>You do not have permission to view this content</p>
          <button
            onClick={() => {
              void signOutButton();
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotAdmin;
