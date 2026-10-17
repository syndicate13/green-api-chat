import { useState } from 'react';
import { Input } from '../Input/Input';
import { formatPhone, isPhoneComplete, normalizePhone } from '../../utils/phoneFormat';
import styles from './StartChatForm.module.scss';

interface Props {
  onSubmit: (phoneNumber: string, name: string) => void;
  loading: boolean;
  error: string;
}

export const StartChatForm = ({ onSubmit, loading, error }: Props) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneComplete(phone)) return;
    onSubmit(normalizePhone(phone), name.trim());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Новый чат</h2>
      <Input
        label="Номер телефона"
        value={phone}
        onChange={setPhone}
        placeholder="+7 (999) 123-45-67"
        error={!!error}
        format={formatPhone}
        inputMode="tel"
      />
      <Input label="Имя получателя (необязательно)" value={name} onChange={setName} placeholder="Игорь" />
      <button className={styles.submit} type="submit" disabled={loading || !isPhoneComplete(phone)}>
        {loading ? 'Проверяем...' : 'Начать чат'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};
