import { Play, Pause, SkipForward, CheckCircle2, List, BarChart3, Settings } from 'lucide-react';
import { useStore } from '../store';
import { formatTime } from '../utils/time';

export function TimerView() {
  const {
    timer,
    settings,
    tasks,
    startTimer,
    pauseTimer,
    resumeTimer,
    skipPhase,
    setView,
  } = useStore();

  const currentTask = tasks.find((t) => t.id === timer.currentTaskId);
  const totalTime = settings[`${timer.phase}Duration`] * 60;
  const progress = ((totalTime - timer.timeLeft) / totalTime) * 100;

  const phaseLabel = {
    work: '专注中',
    shortBreak: '短休息',
    longBreak: '长休息',
  };

  const phaseColor = {
    work: '#A06048',
    shortBreak: '#6B8E5E',
    longBreak: '#6B8FA8',
  };

  const handleToggle = () => {
    if (timer.isRunning) {
      pauseTimer();
    } else if (timer.isPaused) {
      resumeTimer();
    } else {
      startTimer();
    }
  };

  return (
    <div className="timer-view">
      <div className="phase-badge" style={{ color: phaseColor[timer.phase] }}>
        {phaseLabel[timer.phase]}
      </div>

      <div className="timer-display" style={{ color: phaseColor[timer.phase] }}>
        {formatTime(timer.timeLeft)}
      </div>

      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%`, backgroundColor: phaseColor[timer.phase] }}
        />
      </div>

      <div className="timer-controls">
        <button className="ctrl-btn primary" onClick={handleToggle}>
          {timer.isRunning ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button className="ctrl-btn" onClick={skipPhase}>
          <SkipForward size={18} />
        </button>
        <button
          className="ctrl-btn"
          onClick={() => currentTask && useStore.getState().completePhase()}
          title="完成任务"
        >
          <CheckCircle2 size={18} />
        </button>
      </div>

      <div className="current-task" onClick={() => setView('tasks')}>
        {currentTask ? `当前：${currentTask.title}` : '点击选择任务'}
      </div>

      <div className="bottom-nav">
        <button className="nav-btn" onClick={() => setView('tasks')}>
          <List size={18} />
          <span>任务</span>
        </button>
        <button className="nav-btn" onClick={() => setView('stats')}>
          <BarChart3 size={18} />
          <span>统计</span>
        </button>
        <button className="nav-btn" onClick={() => setView('settings')}>
          <Settings size={18} />
          <span>设置</span>
        </button>
      </div>
    </div>
  );
}
