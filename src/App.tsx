import { useState } from 'react';
import { LoginContainer } from './containers/LoginContainer/LoginContainer';
import { ChatContainer } from './containers/ChatContainer/ChatContainer';
import { clearCredentials, loadCredentials } from './storage/credentialsStorage';
import type { Credentials } from './types';
import styles from './App.module.scss';

export const App = () => {
  const [credentials, setCredentials] = useState<Credentials | null>(() => loadCredentials());

  const handleLogin = (creds: Credentials) => setCredentials(creds);

  const handleLogout = () => {
    clearCredentials();
    setCredentials(null);
  };

  return (
    <div className={styles.app}>
      {credentials ? (
        <ChatContainer credentials={credentials} onLogout={handleLogout} />
      ) : (
        <LoginContainer onLogin={handleLogin} />
      )}
    </div>
  );
};
