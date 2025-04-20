import { atom } from 'jotai';

export interface User {
  id?: string;
  email?: string;
}

export const userStateAtom = atom<User | null>(null);
