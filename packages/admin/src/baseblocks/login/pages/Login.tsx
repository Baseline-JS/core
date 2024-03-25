import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import styles from './Login.module.scss';

function Login() {
  return (
    <div className={styles.login}>
      <div className={styles.content}>
        <Authenticator />
      </div>
    </div>
  );
}
export default Login;
