import { useEffect, useRef } from 'react';
import { useStore } from './store';
import { TimerView } from './components/TimerView';
import { TaskView } from './components/TaskView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { WindowDragArea } from './components/WindowDragArea';
import { loadData, saveDataDebounced } from './utils/persistence';
import { playBellSound } from './utils/audio';
import { sendNotification, isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification';
import './App.css';

async function notify(title: string, body: string) {
  try {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
      sendNotification({ title, body });
    }
  } catch {
    // ignore notification errors
  }
}

function App() {
  const { timer, currentView } = useStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Timer interval
  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        const state = useStore.getState();
        if (state.timer.timeLeft <= 1) {
          const { settings, timer: t } = state;
          // Play sound before completing phase
          if (settings.soundEnabled) {
            playBellSound();
          }
          // Send notification
          const phaseNames: Record<string, string> = {
            work: '专注完成',
            shortBreak: '短休息结束',
            longBreak: '长休息结束',
          };
          const nextPhaseNames: Record<string, string> = {
            work: '开始专注',
            shortBreak: '开始短休息',
            longBreak: '开始长休息',
          };
          const currentPhase = phaseNames[t.phase] || '';
          const nextPhase = t.phase === 'work'
            ? (state.timer.completedCycles + 1) % settings.longBreakInterval === 0
              ? nextPhaseNames.longBreak
              : nextPhaseNames.shortBreak
            : nextPhaseNames.work;
          notify(`${currentPhase}！`, `${nextPhase}吧`);
          state.completePhase();
        } else {
          state.tick();
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning]);

  // Auto-save when data changes
  useEffect(() => {
    const unsubscribe = useStore.subscribe((state, prevState) => {
      if (
        state.tasks !== prevState.tasks ||
        state.records !== prevState.records ||
        state.settings !== prevState.settings
      ) {
        saveDataDebounced(state.settings, state.tasks, state.records);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="app-container">
      <WindowDragArea />
      <div className="content-area">
        {currentView === 'timer' && <TimerView />}
        {currentView === 'tasks' && <TaskView />}
        {currentView === 'stats' && <StatsView />}
        {currentView === 'settings' && <SettingsView />}
      </div>
    </div>
  );
}

export default App;
