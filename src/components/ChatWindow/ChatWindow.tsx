import { MessageList } from '../MessageList/MessageList';
import { MessageInput } from '../MessageInput/MessageInput';
import { StartChatForm } from '../StartChatForm/StartChatForm';
import type { ChatTarget, Message } from '../../types';
import styles from './ChatWindow.module.scss';

interface Props {
  target: ChatTarget | null;
  messages: Message[];
  sending: boolean;
  loadingChat: boolean;
  startError: string;
  chatError: string;
  onStartChat: (phoneNumber: string, name: string) => void;
  onSend: (text: string) => void;
  onBack: () => void;
  onLogout: () => void;
}

const getInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed ? trimmed[0].toUpperCase() : '?';
};

export const ChatWindow = ({
  target,
  messages,
  sending,
  loadingChat,
  startError,
  chatError,
  onStartChat,
  onSend,
  onBack,
  onLogout,
}: Props) => {
  if (!target) {
    return (
      <div className={styles.startScreen}>
        <StartChatForm onSubmit={onStartChat} loading={loadingChat} error={startError} />
        <button className={styles.logout} onClick={onLogout} type="button">
          Выйти
        </button>
      </div>
    );
  }

  const displayName = target.name || target.chatId;

  return (
    <div className={styles.chat}>
      <div className={styles.patternBg} />

      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 19V5M5 12l7-7 7 7"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>

        <div className={styles.avatar}>{getInitial(displayName)}</div>

        <div className={styles.headerInfo}>
          <span className={styles.headerName}>{displayName}</span>
          <span className={styles.headerStatus}>был(а) недавно</span>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.headerIcon} type="button" aria-label="Позвонить">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className={styles.headerIcon} type="button" aria-label="Видеозвонок">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M23 7l-7 5 7 5V7zM14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className={styles.headerIcon} type="button" aria-label="Поиск">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <MessageList messages={messages} />

      {chatError && <div className={styles.chatError}>{chatError}</div>}

      <MessageInput onSend={onSend} disabled={sending} />
    </div>
  );
};
