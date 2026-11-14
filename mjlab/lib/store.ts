"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FormData = {
  activity: string;
  idea: string;
  budget: string;
  delay: string;
  firstName: string;
  email: string;
  phone: string;
};

export const emptyForm: FormData = {
  activity: "",
  idea: "",
  budget: "",
  delay: "",
  firstName: "",
  email: "",
  phone: "",
};

type UIState = {
  contactOpen: boolean;
  menuOpen: boolean;
  loaderDone: boolean;
  contactInView: boolean;
  openContact: (activity?: string) => void;
  closeContact: () => void;
  setMenu: (v: boolean) => void;
  setLoaderDone: () => void;
  setContactInView: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  contactOpen: false,
  menuOpen: false,
  loaderDone: false,
  contactInView: false,
  openContact: (activity) => {
    if (activity) {
      const f = useForm.getState();
      f.update({ activity });
      // l'étape 1 est déjà répondue : on ouvre directement sur l'étape 2
      if (f.step === 0 && !f.sent) f.setStep(1);
    }
    set({ contactOpen: true, menuOpen: false });
  },
  closeContact: () => set({ contactOpen: false }),
  setMenu: (v) => set({ menuOpen: v }),
  setLoaderDone: () => set({ loaderDone: true }),
  setContactInView: (v) => set({ contactInView: v }),
}));

/* Le formulaire garde ses réponses (effet Zeigarnik) : fermé en cours de
   route, il se rouvre à la même étape. Stockage local, rien n'est envoyé
   avant la dernière étape. */
type FormState = {
  step: number;
  data: FormData;
  sent: boolean;
  update: (patch: Partial<FormData>) => void;
  setStep: (s: number) => void;
  markSent: () => void;
  reset: () => void;
};

export const useForm = create<FormState>()(
  persist(
    (set) => ({
      step: 0,
      data: emptyForm,
      sent: false,
      update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
      setStep: (step) => set({ step }),
      markSent: () => set({ sent: true }),
      reset: () => set({ step: 0, data: emptyForm, sent: false }),
    }),
    {
      name: "mjlab-projet",
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch {
          return sessionStorage;
        }
      }),
    }
  )
);

/** Un projet est « en cours » si au moins une réponse est donnée et rien n'est envoyé. */
export function isInProgress(s: { data: FormData; sent: boolean }) {
  return !s.sent && Object.values(s.data).some((v) => v.trim() !== "");
}
