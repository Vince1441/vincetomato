import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import { useStore } from '../store';

export function TaskView() {
  const { tasks, timer, closePanel, setActiveTask, addTask, deleteTask } = useStore();
  const [newTitle, setNewTitle] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (newTitle.trim()) {
      addTask(newTitle.trim());
      setNewTitle('');
      setShowInput(false);
    }
  };

  return (
    <div className="panel-view">
      <div className="panel-header">
        <button className="back-btn" onClick={closePanel}>
          <ArrowLeft size={18} />
        </button>
        <span className="panel-title">今日任务</span>
        <div style={{ width: 28 }} />
      </div>

      <div className="task-list">
        {tasks.length === 0 && (
          <div className="empty-state">还没有任务，添加一个吧</div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.id === timer.currentTaskId ? 'active' : ''}`}
            onClick={() => setActiveTask(task.id)}
          >
            <div className="task-info">
              <span className="task-title">{task.title}</span>
              <span className="task-pomos">
                {task.completedPomodoros > 0 ? `${task.completedPomodoros} 🍅` : ''}
              </span>
            </div>
            <div className="task-actions">
              {task.id === timer.currentTaskId && <Check size={16} className="check-icon" />}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showInput ? (
        <div className="add-task-input">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="任务名称"
            autoFocus
          />
          <button className="confirm-btn" onClick={handleAdd}>
            <Check size={16} />
          </button>
        </div>
      ) : (
        <button className="add-task-btn" onClick={() => setShowInput(true)}>
          <Plus size={16} />
          <span>添加新任务</span>
        </button>
      )}
    </div>
  );
}
