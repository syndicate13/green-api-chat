import { useCallback, useRef, useState } from 'react';
import { ChatWindow } from '../../components/ChatWindow/ChatWindow';
import { checkAccount, deleteNotification, receiveNotification, sendMessage } from '../../api/greenApi';
import { isOutgoingApiMessage, parseNotificationToMessage, parseStatusNotification } from '../../api/parseNotification';
import { usePolling } from '../../hooks/usePolling';
import type { ChatTarget, Credentials, Message } from '../../types';

interface Props {
  credentials: Credentials;
  onLogout: () => void;
}

const MATCH_WINDOW_SEC = 30;

export const ChatContainer = ({ credentials, onLogout }: Props) => {
  const [target, setTarget] = useState<ChatTarget | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [startError, setStartError] = useState('');
  const [chatError, setChatError] = useState('');

  const targetRef = useRef<ChatTarget | null>(null);
  targetRef.current = target;

  const pendingRef = useRef<{ text: string; sentAt: number }[]>([]);

  const handleTick = useCallback(async () => {
    const notification = await receiveNotification(credentials);
    if (!notification) return;

    try {
      const currentTarget = targetRef.current;

      const statusUpdate = parseStatusNotification(notification);
      if (statusUpdate) {
        setMessages(prev =>
          prev.map(m => (m.id === statusUpdate.idMessage ? { ...m, status: statusUpdate.status } : m)),
        );
        return;
      }

      if (!currentTarget) return;

      const message = parseNotificationToMessage(notification);
      if (!message) return;

      const chatId = notification.body?.senderData?.chatId;
      const sender = notification.body?.senderData?.sender;

      const belongsToChat = chatId === currentTarget.chatId || sender === currentTarget.chatId;

      if (!belongsToChat) return;

      if (isOutgoingApiMessage(notification)) {
        setMessages(prev => replacePending(prev, message, pendingRef.current));
      } else {
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    } finally {
      await deleteNotification(credentials, notification.receiptId);
    }
  }, [credentials]);

  usePolling({
    enabled: Boolean(target),
    intervalMs: 1000,
    onTick: handleTick,
  });

  const handleStartChat = async (phoneNumber: string, name: string) => {
    setLoadingChat(true);
    setStartError('');
    setChatError('');

    try {
      const result = await checkAccount(credentials, phoneNumber);

      if (!result.exist || !result.chatId) {
        setStartError('Аккаунт MAX с таким номером не найден');
        return;
      }

      setTarget({ chatId: result.chatId, name });
      setMessages([]);
      pendingRef.current = [];
    } catch {
      setStartError('Не удалось проверить номер. Попробуйте позже.');
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSend = async (text: string) => {
    if (!target) return;
    setSending(true);
    setChatError('');

    const optimistic: Message = {
      id: `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      isMine: true,
      timestamp: Math.floor(Date.now() / 1000),
      status: 'pending',
    };

    pendingRef.current.push({ text, sentAt: Date.now() });
    setMessages(prev => [...prev, optimistic]);

    try {
      await sendMessage(credentials, target.chatId, text);
    } catch (err: any) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      pendingRef.current = pendingRef.current.filter(p => p.text !== text);

      const code = err?.response?.data?.code;
      const description = err?.response?.data?.description ?? '';

      if (code === 466 || /noAccount/i.test(description)) {
        setChatError('Аккаунт получателя больше не существует');
      } else {
        setChatError('Не удалось отправить сообщение. Попробуйте позже.');
      }
    } finally {
      setSending(false);
    }
  };

  const handleBackToStart = () => {
    setTarget(null);
    setMessages([]);
    pendingRef.current = [];
    setChatError('');
    setStartError('');
  };

  const handleLogout = () => {
    handleBackToStart();
    onLogout();
  };

  return (
    <ChatWindow
      target={target}
      messages={messages}
      sending={sending}
      loadingChat={loadingChat}
      startError={startError}
      chatError={chatError}
      onStartChat={handleStartChat}
      onSend={handleSend}
      onBack={handleBackToStart}
      onLogout={handleLogout}
    />
  );
};

const replacePending = (
  prev: Message[],
  confirmed: Message,
  pending: { text: string; sentAt: number }[],
): Message[] => {
  const now = Date.now();
  let matchIndex = -1;

  for (let i = prev.length - 1; i >= 0; i--) {
    const m = prev[i];
    if (!m.isMine) continue;
    if (!m.id.startsWith('pending-')) continue;
    if (m.text !== confirmed.text) continue;

    const ageSec = (now - m.timestamp * 1000) / 1000;
    if (ageSec > MATCH_WINDOW_SEC) continue;

    matchIndex = i;
    break;
  }

  if (matchIndex === -1) {
    if (prev.some(m => m.id === confirmed.id)) return prev;
    return [...prev, { ...confirmed, status: 'sent' }];
  }

  const pendingIdx = pending.findIndex(p => p.text === confirmed.text);
  if (pendingIdx !== -1) pending.splice(pendingIdx, 1);

  const next = [...prev];
  next[matchIndex] = { ...confirmed, isMine: true, status: 'sent' };
  return next;
};
