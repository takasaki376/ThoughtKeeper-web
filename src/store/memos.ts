import { atom } from "jotai";

import type { Memo } from "@/types/database";

export const recentMemosAtom = atom<Memo[]>([]);
