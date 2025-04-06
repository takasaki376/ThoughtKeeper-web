import { atom } from "jotai";

import type { Memo } from "@/types/database";


// export const memoListAtom = atom<{ content: string; created_at:string; date: string; theme: string;time: string }[]>([]);
export const memoListAtom = atom<Memo[]>([]);
