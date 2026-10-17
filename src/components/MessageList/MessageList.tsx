import { useEffect, useRef } from 'react';
import { MessageItem } from '../MessageItem/MessageItem';
import type { Message } from '../../types';
import styles from './MessageList.module.scss';

interface Props {
  messages: Message[];
}

export const MessageList = ({ messages }: Props) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!messages.length) {
    return <div className={styles.empty}>Нет сообщений</div>;
  }

  return (
    <div className={styles.list}>
      {messages.map(m => (
        <MessageItem key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
