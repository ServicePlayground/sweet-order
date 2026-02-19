import { useState, useEffect } from "react";

/**
 * 입력값을 지연 적용하는 debounce 훅
 * @param value - 원본 값
 * @param delay - 지연 시간 (ms)
 * @returns debounce된 값
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
