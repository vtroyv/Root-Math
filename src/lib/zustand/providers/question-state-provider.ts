import {create} from 'zustand'; 

export type QuestionProgress = {
    _id: string;
    title: string;
    status: string;
    feedback: Array<any>;
    userId: string;
    type:string;
    attempts: number;
    createdAt:string;
    updatedAt: string;
    [key: string]: any
}

export type QuestionStore = {
    userProgress: QuestionProgress | null;
    updateProgress: (progress: QuestionProgress) => void;
    setProgress: (progess: QuestionProgress) => void;
}

export const useQuestionStore = create((set, get) => ({
  userProgress: null,

  setProgress: (progress) =>
    set({ userProgress: progress }),

  updateProgress: (partial) =>
    set((state) => ({
      userProgress: {
        ...(state.userProgress || {}),
        ...partial,
      },
    })),

  // NEW: upsert at componentProgress[index]
  setComponentProgressAt: (index, patch) =>
    set((state) => {
      const up = state.userProgress || {};
      const arr = Array.isArray(up.componentProgress) ? [...up.componentProgress] : [];
      const current = arr[index] || {};
      arr[index] = { ...current, ...patch };
      return { userProgress: { ...up, componentProgress: arr } };
    }),
}));