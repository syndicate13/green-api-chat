import type { Message, MessageStatus } from '../types';

export const parseNotificationToMessage = (notification: any): Message | null => {
  const body = notification?.body;
  if (!body) return null;

  const typeWebhook = body.typeWebhook as string | undefined;
  if (
    typeWebhook !== 'incomingMessageReceived' &&
    typeWebhook !== 'outgoingMessageReceived' &&
    typeWebhook !== 'outgoingAPIMessageReceived'
  ) {
    return null;
  }

  const messageData = body.messageData ?? {};
  const typeMessage = messageData.typeMessage as string | undefined;

  let text = '';
  if (typeMessage === 'textMessage') {
    text = messageData.textMessageData?.textMessage ?? '';
  } else if (typeMessage === 'extendedTextMessage') {
    text = messageData.extendedTextMessageData?.text ?? '';
  }

  if (!text) return null;

  const isMine = typeWebhook === 'outgoingMessageReceived' || typeWebhook === 'outgoingAPIMessageReceived';

  return {
    id: String(body.idMessage ?? Date.now()),
    text,
    isMine,
    timestamp: Number(body.timestamp ?? Math.floor(Date.now() / 1000)),
  };
};

export const isOutgoingApiMessage = (notification: any): boolean =>
  notification?.body?.typeWebhook === 'outgoingAPIMessageReceived';

/**
 * На случай, если GREEN-API когда-нибудь начнёт присылать статусы.
 * Сейчас для MAX такие уведомления не приходят.
 */
export const parseStatusNotification = (notification: any): { idMessage: string; status: MessageStatus } | null => {
  const body = notification?.body;
  if (!body) return null;
  if (body.typeWebhook !== 'outgoingMessageStatus') return null;

  const idMessage = body.idMessage;
  const rawStatus = body.status as string | undefined;
  if (!idMessage || !rawStatus) return null;

  if (rawStatus === 'sent' || rawStatus === 'delivered' || rawStatus === 'read') {
    return { idMessage, status: 'sent' };
  }

  return null;
};
