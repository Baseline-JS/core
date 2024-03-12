import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import styles from './UserSettings.module.scss';

interface UserInfo {
  id?: string;
  username: string;
  attributes: Record<string, string>;
}

interface Props {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSettings = (props: Props): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [hasSubmitEmailChange, setHasSubmitEmailChange] = useState(false);
  const [isCodeInvalid, setIsCodeInvalid] = useState<undefined | boolean>();
  const [changingEmailCode, setChangingEmailCode] = useState('');
  const { setIsLoading } = props;

  const getUserDetails = async () => {
    const info = (await Auth.currentUserInfo()) as UserInfo;
    setEmail(info.attributes.email);
    setHasSubmitEmailChange(!info.attributes.email_verified);
  };

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      await getUserDetails();
      setIsLoading(false);
    })();
  }, []);

  const handleEmailChange = async () => {
    const user = (await Auth.currentAuthenticatedUser()) as CognitoUser;
    const info = (await Auth.currentUserInfo()) as UserInfo;

    setIsChangingEmail(false);

    if (info.attributes.email !== email) {
      setHasSubmitEmailChange(true);
      await Auth.updateUserAttributes(user, {
        email,
      });
    }
  };

  const finaliseEmailChange = async () => {
    try {
      await Auth.verifyCurrentUserAttributeSubmit('email', changingEmailCode);
      setHasSubmitEmailChange(false);
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
              disabled={hasSubmitEmailChange}
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
        {hasSubmitEmailChange ? (
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
                  void finaliseEmailChange();
                }}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setHasSubmitEmailChange(false);
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
            void Auth.signOut();
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
