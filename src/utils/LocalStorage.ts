import React from 'react';

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  key = `_yukicoder_problems_${key}`;
  const a = localStorage.getItem(key);
  const [value, setValue] = React.useState(
    a ? (JSON.parse(a) as T) : defaultValue
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
