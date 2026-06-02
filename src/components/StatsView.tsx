import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store';
import { useMemo } from 'react';

export function StatsView() {
  const { records, closePanel } = useStore();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter((r) => r.completedAt.startsWith(today));

    const workRecords = todayRecords.filter((r) => r.type === 'work');
    const totalMinutes = workRecords.reduce((sum, r) => sum + r.duration, 0);

    // Weekly data (last 7 days)
    const weekData: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = records.filter(
        (r) => r.completedAt.startsWith(dateStr) && r.type === 'work'
      ).length;
      weekData.push(count);
    }

    const maxVal = Math.max(...weekData, 1);

    return {
      pomodoros: workRecords.length,
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      weekData,
      maxVal,
    };
  }, [records]);

  const weekLabels = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className="panel-view">
      <div className="panel-header">
        <button className="back-btn" onClick={closePanel}>
          <ArrowLeft size={18} />
        </button>
        <span className="panel-title">今日统计</span>
        <div style={{ width: 28 }} />
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.pomodoros}</div>
          <div className="stat-label">完成番茄</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {stats.hours}h {stats.minutes}m
          </div>
          <div className="stat-label">专注时长</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">本周趋势</div>
        <div className="chart-bars">
          {stats.weekData.map((val, i) => (
            <div key={i} className="bar-wrapper">
              <div
                className="bar"
                style={{ height: `${(val / stats.maxVal) * 60}px` }}
              />
              <span className="bar-label">{weekLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
