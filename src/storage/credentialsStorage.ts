import type { Credentials } from '../types';

const STORAGE_KEY = 'green-api-credentials';

export const saveCredentials = (credentials: Credentials) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  } catch {
    // localStorage может быть отключён — игнорируем
  }
};

export const loadCredentials = (): Credentials | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Credentials;
    if (!parsed.idInstance || !parsed.apiTokenInstance) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearCredentials = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // игнорируем
  }
};
