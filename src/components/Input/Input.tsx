import clsx from 'clsx';
import styles from './Input.module.scss';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  type?: 'text' | 'password';
  className?: string;
  format?: (raw: string) => string;
  inputMode?: 'text' | 'tel' | 'numeric';
}

export const Input = ({
  label,
  value,
  onChange,
  placeholder,
  error = false,
  type = 'text',
  className,
  format,
  inputMode,
}: Props) => {
  const displayValue = format ? format(value) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className={clsx(styles.wrapper, className)}>
      <span className={styles.label}>{label}</span>
      <input
        type={type}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        inputMode={inputMode}
        className={clsx(styles.input, error && styles.inputError)}
      />
    </label>
  );
};
