// src/hooks/useCookie.js
import { useState, useEffect } from 'react';

const useCookie = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      const parsedValue = item ? JSON.parse(item) : initialValue;
      // Convert date strings back to Date objects
      if (parsedValue && typeof parsedValue === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(parsedValue)) {
        return new Date(parsedValue);
      }
      return parsedValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Convert Date objects to ISO strings before storing
      const valueToStore = value instanceof Date ? value.toISOString() : value;
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useCookie;