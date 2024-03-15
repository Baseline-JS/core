import {
  signOut,
  updateUserAttributes,
  confirmUserAttribute,
  fetchUserAttributes,
} from 'aws-amplify/auth';
import React, { useEffect, useState } from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import styles from './UserSettings.module.scss';

interface Props {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSettings = (props: Props): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeInvalid, setIsCodeInvalid] = useState<undefined | boolean>();
  const [changingEmailCode, setChangingEmailCode] = useState('');
  const { setIsLoading } = props;

  const getUserDetails = async () => {
    const { email, email_verified } = await fetchUserAttributes();
    setEmail(email);
    setIsEmailVerified(email_verified !== 'false');
  };

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      await getUserDetails();
      setIsLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmailChange = async () => {
    const attributes = await fetchUserAttributes();
    setIsChangingEmail(false);
    if (attributes.email !== email) {
      setIsEmailVerified(false);
      await updateUserAttributes({
        userAttributes: {
          email: email,
        },
      });
    }
  };

  const finalizeEmailChange = async () => {
    try {
      await confirmUserAttribute({
        userAttributeKey: 'email',
        confirmationCode: changingEmailCode,
      });
      setIsEmailVerified(true);
      setChangingEmailCode('');
    } catch {
      console.log('Invalid code');
      setIsCodeInvalid(true);
    }
  };

  return (
    <div className={styles.userSettings}>
      <h1>Account settings</h1>
      <div className={styles.settings}>
        <FormGroup>
          <Label for="email">Email</Label>
          <div className={styles.email}>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              disabled={!isChangingEmail}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              disabled={!isEmailVerified}
              onClick={() => {
                isChangingEmail
                  ? void handleEmailChange()
                  : setIsChangingEmail(true);
              }}
            >
              {isChangingEmail ? 'Update' : 'Edit'}
            </button>
          </div>
        </FormGroup>
        {!isEmailVerified ? (
          <FormGroup>
            <Label for="code">Check your email for a code</Label>
            <div className={styles.email}>
              <Input
                name="code"
                id="code"
                type="text"
                placeholder="Code"
                invalid={isCodeInvalid}
                value={changingEmailCode}
                onChange={(e) => setChangingEmailCode(e.target.value)}
              />
              <button
                onClick={() => {
                  void finalizeEmailChange();
                }}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setIsEmailVerified(true);
                  setIsChangingEmail(true);
                }}
              >
                Cancel
              </button>
            </div>
            <FormFeedback className={isCodeInvalid ? 'd-block' : ''}>
              Code is invalid
            </FormFeedback>
          </FormGroup>
        ) : (
          <></>
        )}
        <button
          className={styles.signOut}
          onClick={() => {
            void signOut();
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
