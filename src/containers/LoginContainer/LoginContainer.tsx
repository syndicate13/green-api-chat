import { useState } from 'react';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { getSettings } from '../../api/greenApi';
import { saveCredentials } from '../../storage/credentialsStorage';
import type { Credentials } from '../../types';

interface Props {
  onLogin: (credentials: Credentials) => void;
}

export const LoginContainer = ({ onLogin }: Props) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (credentials: Credentials) => {
    setLoading(true);
    setError('');
    try {
      await getSettings(credentials);
      saveCredentials(credentials);
      onLogin(credentials);
    } catch {
      setError('Неверный idInstance или apiTokenInstance');
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />;
};
