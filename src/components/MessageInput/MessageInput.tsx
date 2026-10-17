import { useEffect, useRef, useState } from 'react';
import styles from './MessageInput.module.scss';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

const MAX_HEIGHT = 120;

export const MessageInput = ({ onSend, disabled }: Props) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className={styles.wrapper}>
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        {/* Кнопка плюс/скрепка */}
        <button type="button" className={styles.attachButton} tabIndex={-1}>
          <svg width="24" height="24" viewBox="0 0 126.04 108.78">
            <g>
              <path
                fill="currentColor"
                d="M290.1,425.9a27.34,27.34,0,0,1,0-39.4l0,0h0L332.6,344a2.86,2.86,0,0,0-4-4l-42.5,42.5a33.06,33.06,0,0,0,0,47.49,34.35,34.35,0,0,0,48.57,0l-4.09-4A28.62,28.62,0,0,1,290.1,425.9Zm24.28-23.21a11.45,11.45,0,0,0,16.19,0l30.35-30.35a2.86,2.86,0,0,0-4-4l-30.36,30.35a5.72,5.72,0,1,1-8.09-8.09l8.09-8.09L367,342l-4-4L314.38,386.5A11.45,11.45,0,0,0,314.38,402.69Zm20.24-20.23h0Zm60.7-44.53a22.9,22.9,0,0,0-32.38,0l4,4a17.17,17.17,0,0,1,24.28,24.29L330.57,425.9l4,4,60.71-59.64A22.9,22.9,0,0,0,395.33,337.93Z"
                transform="translate(-276 -331.23)"
              />
            </g>
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение"
          rows={1}
        />

        <button type="submit" className={styles.sendButton} disabled={!canSend}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 19V5M5 12l7-7 7 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
