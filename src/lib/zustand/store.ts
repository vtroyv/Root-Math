import { create } from 'zustand';

export type Lesson = {
  collection: string;
  next: string;
  parts: Array<{id:number, blocks:any[], title:string}>;
  slug: string;
  title: string;
  _id: string;
};

export type currentPart = number;

export type LessonStore = {
  lesson: Lesson | null;
  currentPart: number;
  tasks: any[];
  addLesson: (lesson: Lesson) => void;
  removeLesson: () => void;
  updateCurrentPart: (currentPart: number) => void;
};

export const useLessonStore = create<LessonStore>((set,get) => ({
  lesson: null,
  currentPart:1, // you need to add to your component a updating current part method and yo
  tasks:[],
  addLesson: (lesson) =>
    set((state) => ({
      lesson,
      tasks:
        lesson.parts[state.currentPart].blocks.filter((part) => part.type == 'task') ?? []
    })),
removeLesson: () => set({ lesson: null }),
updateCurrentPart: (currentPart) =>
    set((state) => ({
      currentPart,
      tasks: state.lesson
        ? state.lesson.parts[currentPart].blocks.filter((part) => part.type === 'task') ?? []
        : [],
    })),
  



}));

//Now you'll need to continue adding code so that we store the current latex, and other details such as userProgress for when users submit a query to the myTutor,