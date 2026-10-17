import { useEffect, useRef } from 'react';

interface Options {
  enabled: boolean;
  intervalMs: number; // пауза между успешными опросами
  onTick: () => Promise<void>;
}

export const usePolling = ({ enabled, intervalMs, onTick }: Options) => {
  const timeoutRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    stoppedRef.current = false;

    const loop = async () => {
      if (stoppedRef.current) return;

      try {
        await onTick();
      } catch {
        // игнорируем, чтобы цикл не упал
      }

      if (stoppedRef.current) return;
      timeoutRef.current = window.setTimeout(loop, intervalMs);
    };

    loop();

    return () => {
      stoppedRef.current = true;
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, intervalMs, onTick]);
};
