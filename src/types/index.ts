export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export type MessageStatus = 'pending' | 'sent';

export interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: number;
  status?: MessageStatus;
}

export interface ChatTarget {
  chatId: string;
  name: string;
}
