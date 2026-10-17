export const normalizePhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('8')) return '7' + digits.slice(1);
  if (digits.startsWith('7')) return digits;
  return '7' + digits;
};

export const formatPhone = (raw: string): string => {
  const digits = normalizePhone(raw).slice(0, 11); // 7 + 10 цифр

  if (digits.length === 0) return '';
  if (digits.length === 1) return '+7';

  const rest = digits.slice(1);

  let result = '+7';
  if (rest.length > 0) result += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) result += ')';
  if (rest.length > 3) result += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) result += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) result += `-${rest.slice(8, 10)}`;

  return result;
};

export const isPhoneComplete = (raw: string): boolean => {
  const digits = normalizePhone(raw);
  return digits.length === 11;
};
