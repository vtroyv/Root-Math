import { create } from 'zustand';

export type Lesson = {
  collection: string;
  next: string;
  parts: Array<{ id: number; blocks: any[]; title: string }>;
  slug: string;
  title: string;
  _id: string;
};

export type currentPart = number;

// Define a flexible Task type with common keys and an index signature.
export type Task = {
  [key: string]: any;
};

export type LessonStore = {
  lesson: Lesson | null;
  currentPart: number;
  tasks: Task[];
  taskState: Task[];
  taskType: any[];
  addLesson: (lesson: Lesson) => void;
  removeLesson: () => void;
  updateCurrentPart: (currentPart: number) => void;
  updateTaskState: (updatedTask: Task) => void;
};

export const useLessonStore = create<LessonStore>((set, get) => ({
  lesson: null,
  currentPart: 1,
  tasks: [],
  taskState: [],
  addLesson: (lesson) =>
    set((state) => ({
      lesson,
      tasks:
        lesson.parts[state.currentPart].blocks.filter(
          (part) => part.type === 'task'
        ) ?? [],
      taskState:
        lesson.parts[state.currentPart].blocks.filter(
          (part) => part.type === 'task'
        ) ?? [],
    })),
  taskType: [],
  removeLesson: () => set({ lesson: null }),
  updateCurrentPart: (currentPart) =>
    set((state) => ({
      currentPart,
      tasks: state.lesson
        ? state.lesson.parts[currentPart].blocks.filter(
            (part) => part.type === 'task'
          ) ?? []
        : [],
      taskState: state.lesson
        ? state.lesson.parts[currentPart].blocks.filter(
            (part) => part.type === 'task'
          ) ?? []
        : [],
    })),
  updateTaskState: (updatedTask: Task) =>
    set((state) => {
      // Try to find an existing task with the same title.
      const existingIndex = state.taskState.findIndex(
        (task) => task.title === updatedTask.title
      );

      // If found, merge the new keys into the existing task.
      if (existingIndex !== -1) {
        const newTaskState = [...state.taskState];
        newTaskState[existingIndex] = {
          ...newTaskState[existingIndex],
          ...updatedTask,
        };
        return { taskState: newTaskState };
      }

      // Otherwise, add the new task to the array.
      return { taskState: [...state.taskState, updatedTask] };
    }),
}));


//Now we need to update the updateTaskState function so that if no task in the task 