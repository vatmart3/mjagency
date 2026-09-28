"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** État d'une session d'appels en cours (survit à un rechargement de page). */
interface CallSessionState {
  sessionId: string | null;
  queue: string[];
  index: number;
  startedAt: number | null;
  callStartedAt: number | null;
  durationMin: number;
  notes: Record<string, string>;
  results: { prospectId: string; outcome: string; at: number; sec: number }[];
  start: (sessionId: string, queue: string[], durationMin: number) => void;
  startCall: () => void;
  record: (prospectId: string, outcome: string) => void;
  next: () => void;
  goto: (i: number) => void;
  setNote: (prospectId: string, text: string) => void;
  reset: () => void;
}

export const useCallSession = create<CallSessionState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      queue: [],
      index: 0,
      startedAt: null,
      callStartedAt: null,
      durationMin: 45,
      notes: {},
      results: [],
      start: (sessionId, queue, durationMin) =>
        set({ sessionId, queue, durationMin, index: 0, startedAt: Date.now(), callStartedAt: null, notes: {}, results: [] }),
      startCall: () => set({ callStartedAt: Date.now() }),
      record: (prospectId, outcome) => {
        const s = get();
        const sec = s.callStartedAt ? Math.round((Date.now() - s.callStartedAt) / 1000) : 0;
        set({ results: [...s.results, { prospectId, outcome, at: Date.now(), sec }], callStartedAt: null });
      },
      next: () => set((s) => ({ index: Math.min(s.queue.length, s.index + 1), callStartedAt: null })),
      goto: (i) => set({ index: i, callStartedAt: null }),
      setNote: (prospectId, text) => set((s) => ({ notes: { ...s.notes, [prospectId]: text } })),
      reset: () => set({ sessionId: null, queue: [], index: 0, startedAt: null, callStartedAt: null, notes: {}, results: [] }),
    }),
    { name: "approche.callSession" },
  ),
);
