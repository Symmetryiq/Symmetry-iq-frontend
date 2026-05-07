import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const storage = createMMKV({ id: 'symmetryiq.storage' });

export const zustandStorage: StateStorage = {
  getItem: (key: string) => {
    return storage.getString(key) || null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};
