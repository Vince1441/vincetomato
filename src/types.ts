export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export interface Task {
  id: string;
  title: string;
  completedPomodoros: number;
  isActive: boolean;
  createdAt: string;
}

export interface Record {
  id: string;
  taskId: string;
  taskTitle: string;
  type: TimerPhase;
  duration: number;
  startedAt: string;
  completedAt: string;
}

export interface AppSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  soundEnabled: boolean;
  soundType: string;
  alwaysOnTop: boolean;
}

export type ViewType = 'timer' | 'tasks' | 'stats' | 'settings';
