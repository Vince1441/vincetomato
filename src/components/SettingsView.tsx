import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store';

export function SettingsView() {
  const { settings, closePanel, updateSettings } = useStore();

  return (
    <div className="panel-view">
      <div className="panel-header">
        <button className="back-btn" onClick={closePanel}>
          <ArrowLeft size={18} />
        </button>
        <span className="panel-title">设置</span>
        <div style={{ width: 28 }} />
      </div>

      <div className="settings-list">
        <div className="setting-group">
          <div className="setting-label">工作时长</div>
          <div className="setting-control">
            <input
              type="number"
              min={1}
              max={60}
              value={settings.workDuration}
              onChange={(e) => updateSettings({ workDuration: parseInt(e.target.value) || 1 })}
            />
            <span>分钟</span>
          </div>
        </div>

        <div className="setting-group">
          <div className="setting-label">短休息</div>
          <div className="setting-control">
            <input
              type="number"
              min={1}
              max={30}
              value={settings.shortBreakDuration}
              onChange={(e) =>
                updateSettings({ shortBreakDuration: parseInt(e.target.value) || 1 })
              }
            />
            <span>分钟</span>
          </div>
        </div>

        <div className="setting-group">
          <div className="setting-label">长休息</div>
          <div className="setting-control">
            <input
              type="number"
              min={1}
              max={60}
              value={settings.longBreakDuration}
              onChange={(e) =>
                updateSettings({ longBreakDuration: parseInt(e.target.value) || 1 })
              }
            />
            <span>分钟</span>
          </div>
        </div>

        <div className="setting-group">
          <div className="setting-label">长休息间隔</div>
          <div className="setting-control">
            <input
              type="number"
              min={1}
              max={10}
              value={settings.longBreakInterval}
              onChange={(e) =>
                updateSettings({ longBreakInterval: parseInt(e.target.value) || 1 })
              }
            />
            <span>个番茄</span>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label-row">
            {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>提示音</span>
          </div>
          <button
            className={`toggle-btn ${settings.soundEnabled ? 'on' : ''}`}
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          >
            <div className="toggle-thumb" />
          </button>
        </div>
      </div>
    </div>
  );
}
