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

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  userProgress: null,

  updateProgress: (partialProgress) =>
    set(state => ({
      userProgress: {
        ...state.userProgress!,
        ...partialProgress,
      }
    })),

  setProgress: (progress) => 
    set({
      userProgress: progress
    })

}))