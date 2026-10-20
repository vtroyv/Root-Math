import { create } from 'zustand';

/*
One student's progress on the lesson that's open (tasks-format lessons, src/lib/docs/lessons.md).
Mirrors their `<course>-lesson-progress` document; the lesson page loads it, edits it here and
saves it back. Read it with selectors (useLessonProgressStore((s) => s.progress)), not the whole store.

  progress.tasks['<partId>:<taskId>'] = { response, result, markedResponse, revealed, solution }
*/

export type TaskEntry = {
  response?: any;
  result?: any;
  markedResponse?: any;
  revealed?: boolean;
  solution?: any[];
};

export type LessonProgress = {
  userId: string;
  lessonSlug: string;
  schemaVersion: number;
  currentPart: number;
  tasks: Record<string, TaskEntry>;
  completed: boolean;
  [key: string]: any;
};

export type LessonProgressStore = {
  progress: LessonProgress | null;
  setProgress: (progress: LessonProgress | null) => void;
  updateProgress: (partial: Partial<LessonProgress>) => void;
  setTaskEntry: (key: string, patch: TaskEntry) => void; // merge into one task's entry
  clearTasks: (keys: string[]) => void; // Reset: remove these tasks' entries
};

export const useLessonProgressStore = create<LessonProgressStore>((set) => ({
  progress: null,

  setProgress: (progress) => set({ progress }),

  updateProgress: (partial) => set((state) => ({ progress: state.progress && { ...state.progress, ...partial } })),

  setTaskEntry: (key, patch) =>
    set((state) => {
      if (!state.progress) return {};
      const tasks = state.progress.tasks ?? {};
      return { progress: { ...state.progress, tasks: { ...tasks, [key]: { ...(tasks[key] ?? {}), ...patch } } } };
    }),

  clearTasks: (keys) =>
    set((state) => {
      if (!state.progress) return {};
      const tasks = { ...(state.progress.tasks ?? {}) };
      keys.forEach((key) => delete tasks[key]);
      return { progress: { ...state.progress, tasks } };
    }),
}));
