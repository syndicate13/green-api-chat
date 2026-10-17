import axios from 'axios';
import type { Credentials } from '../types';

// Для MAX используем v3 (или без префикса, оба работают)
const API_URL = 'https://api.green-api.com/v3';

export const getSettings = async ({ idInstance, apiTokenInstance }: Credentials) => {
  const url = `${API_URL}/waInstance${idInstance}/getSettings/${apiTokenInstance}`;
  const { data } = await axios.get(url);
  return data;
};

export const sendMessage = async (
  { idInstance, apiTokenInstance }: Credentials,
  chatId: string, // Для MAX это просто номер: "10000000"
  message: string,
) => {
  const url = `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
  const { data } = await axios.post(url, { chatId, message });
  return data;
};

export const receiveNotification = async ({ idInstance, apiTokenInstance }: Credentials) => {
  const url = `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;
  const { data } = await axios.get(url);
  return data; // null, если нет сообщений
};

export const deleteNotification = async ({ idInstance, apiTokenInstance }: Credentials, receiptId: number) => {
  const url = `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
  const { data } = await axios.delete(url);
  return data;
};

export const checkAccount = async (
  { idInstance, apiTokenInstance }: Credentials,
  phoneNumber: string,
): Promise<{ exist: boolean; chatId?: string }> => {
  const url = `${API_URL}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`;
  const { data } = await axios.post(url, { phoneNumber });
  return data;
};
