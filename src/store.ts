import { create } from 'zustand';
import { AppSettings, Task, Record, TimerPhase, ViewType } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  soundEnabled: true,
  soundType: 'bell',
  alwaysOnTop: true,
};

interface TimerState {
  phase: TimerPhase;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  completedCycles: number;
  currentTaskId: string | null;
  startedAt: number | null;
}

interface AppState {
  // Timer
  timer: TimerState;
  // Data
  tasks: Task[];
  records: Record[];
  settings: AppSettings;
  // UI
  currentView: ViewType;
  panelOpen: boolean;

  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  skipPhase: () => void;
  resetTimer: () => void;
  tick: () => void;
  completePhase: () => void;

  // Task actions
  addTask: (title: string) => void;
  deleteTask: (id: string) => void;
  setActiveTask: (id: string) => void;
  completeTaskPomodoro: (taskId: string) => void;

  // Record actions
  addRecord: (record: Record) => void;

  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;

  // View actions
  setView: (view: ViewType) => void;
  closePanel: () => void;

  // Init
  initStore: (settings: AppSettings, tasks: Task[], records: Record[]) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>((set, get) => ({
  timer: {
    phase: 'work',
    timeLeft: DEFAULT_SETTINGS.workDuration * 60,
    isRunning: false,
    isPaused: false,
    completedCycles: 0,
    currentTaskId: null,
    startedAt: null,
  },
  tasks: [],
  records: [],
  settings: DEFAULT_SETTINGS,
  currentView: 'timer',
  panelOpen: false,

  startTimer: () => {
    const { settings, timer } = get();
    const duration = settings[`${timer.phase}Duration`] * 60;
    set({
      timer: {
        ...timer,
        isRunning: true,
        isPaused: false,
        timeLeft: timer.timeLeft > 0 && timer.timeLeft < duration ? timer.timeLeft : duration,
        startedAt: timer.startedAt ?? Date.now(),
      },
    });
  },

  pauseTimer: () => {
    const { timer } = get();
    set({ timer: { ...timer, isRunning: false, isPaused: true } });
  },

  resumeTimer: () => {
    const { timer } = get();
    set({ timer: { ...timer, isRunning: true, isPaused: false } });
  },

  skipPhase: () => {
    get().completePhase();
  },

  resetTimer: () => {
    const { settings } = get();
    set({
      timer: {
        phase: 'work',
        timeLeft: settings.workDuration * 60,
        isRunning: false,
        isPaused: false,
        completedCycles: 0,
        currentTaskId: null,
        startedAt: null,
      },
    });
  },

  tick: () => {
    const { timer } = get();
    if (!timer.isRunning || timer.timeLeft <= 0) return;
    set({ timer: { ...timer, timeLeft: timer.timeLeft - 1 } });
  },

  completePhase: () => {
    const { timer, settings } = get();
    const currentTaskId = timer.currentTaskId;
    const now = Date.now();

    // Add record for completed phase
    if (timer.startedAt && currentTaskId) {
      const currentTask = get().tasks.find((t) => t.id === currentTaskId);
      if (currentTask) {
        const record: Record = {
          id: generateId(),
          taskId: currentTaskId,
          taskTitle: currentTask.title,
          type: timer.phase,
          duration: settings[`${timer.phase}Duration`],
          startedAt: new Date(timer.startedAt).toISOString(),
          completedAt: new Date(now).toISOString(),
        };
        get().addRecord(record);
        if (timer.phase === 'work') {
          get().completeTaskPomodoro(currentTaskId);
        }
      }
    }

    // Determine next phase
    let nextPhase: TimerPhase;
    let nextCycles = timer.completedCycles;

    if (timer.phase === 'work') {
      nextCycles = timer.completedCycles + 1;
      if (nextCycles % settings.longBreakInterval === 0) {
        nextPhase = 'longBreak';
      } else {
        nextPhase = 'shortBreak';
      }
    } else {
      nextPhase = 'work';
    }

    const nextDuration = settings[`${nextPhase}Duration`] * 60;

    set({
      timer: {
        ...timer,
        phase: nextPhase,
        timeLeft: nextDuration,
        isRunning: false,
        isPaused: false,
        completedCycles: nextCycles,
        startedAt: null,
      },
    });
  },

  addTask: (title: string) => {
    const newTask: Task = {
      id: generateId(),
      title,
      completedPomodoros: 0,
      isActive: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  deleteTask: (id: string) => {
    set((state) => {
      const filtered = state.tasks.filter((t) => t.id !== id);
      const newState: Partial<AppState> = { tasks: filtered };
      if (state.timer.currentTaskId === id) {
        newState.timer = { ...state.timer, currentTaskId: null };
      }
      return newState as AppState;
    });
  },

  setActiveTask: (id: string) => {
    set((state) => ({
      tasks: state.tasks.map((t) => ({ ...t, isActive: t.id === id })),
      timer: { ...state.timer, currentTaskId: id },
    }));
  },

  completeTaskPomodoro: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t
      ),
    }));
  },

  addRecord: (record: Record) => {
    set((state) => ({ records: [...state.records, record] }));
  },

  updateSettings: (partial: Partial<AppSettings>) => {
    set((state) => {
      const newSettings = { ...state.settings, ...partial };
      // If timer is not running, update timeLeft to match new duration
      let newTimer = state.timer;
      if (!state.timer.isRunning) {
        const duration = newSettings[`${state.timer.phase}Duration`] * 60;
        newTimer = { ...state.timer, timeLeft: duration };
      }
      return { settings: newSettings, timer: newTimer };
    });
  },

  setView: (view: ViewType) => {
    set({ currentView: view, panelOpen: view !== 'timer' });
  },

  closePanel: () => {
    set({ currentView: 'timer', panelOpen: false });
  },

  initStore: (settings, tasks, records) => {
    const activeTask = tasks.find((t) => t.isActive);
    set({
      settings,
      tasks,
      records,
      timer: {
        phase: 'work',
        timeLeft: settings.workDuration * 60,
        isRunning: false,
        isPaused: false,
        completedCycles: 0,
        currentTaskId: activeTask?.id ?? null,
        startedAt: null,
      },
    });
  },
}));
