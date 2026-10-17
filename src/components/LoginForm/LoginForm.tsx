import { useState } from 'react';
import { Input } from '../Input/Input';
import type { Credentials } from '../../types';
import styles from './LoginForm.module.scss';

interface Props {
  onSubmit: (credentials: Credentials) => void;
  loading: boolean;
  error: string;
}

export const LoginForm = ({ onSubmit, loading, error }: Props) => {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idInstance.trim() || !apiTokenInstance.trim()) return;
    onSubmit({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() });
  };

  return (
    <div className={styles.loginFormWrapper}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>GREEN-API Chat</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="idInstance"
            value={idInstance}
            onChange={setIdInstance}
            placeholder="1101000000"
            error={!!error}
          />
          <Input
            label="apiTokenInstance"
            value={apiTokenInstance}
            onChange={setApiTokenInstance}
            placeholder="Вставьте токен"
            type="password"
            error={!!error}
          />
          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Проверка...' : 'Войти'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};
