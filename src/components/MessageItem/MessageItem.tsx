import clsx from 'clsx';
import type { Message, MessageStatus } from '../../types';
import styles from './MessageItem.module.scss';

interface Props {
  message: Message;
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const StatusIcon = ({ status }: { status?: MessageStatus }) => {
  if (!status) return null;

  if (status === 'pending') {
    return (
      <span className={styles.status}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
    );
  }

  return (
    <span className={styles.status}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
};

export const MessageItem = ({ message }: Props) => {
  return (
    <div className={clsx(styles.row, message.isMine && styles.rowMine)}>
      <div className={clsx(styles.bubble, message.isMine ? styles.bubbleMine : styles.bubbleOther)}>
        <p className={styles.text}>{message.text}</p>
        <span className={styles.meta}>
          <span className={styles.time}>{formatTime(message.timestamp)}</span>
          {message.isMine && <StatusIcon status={message.status} />}
        </span>
      </div>
    </div>
  );
};
