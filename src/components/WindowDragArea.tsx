import { useEffect, useRef } from 'react';
import { Window } from '@tauri-apps/api/window';

export function WindowDragArea() {
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dragRef.current;
    if (!el) return;

    const onMouseDown = async () => {
      try {
        const appWindow = Window.getCurrent();
        await appWindow.startDragging();
      } catch {
        // ignore
      }
    };

    el.addEventListener('mousedown', onMouseDown);
    return () => el.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <div ref={dragRef} className="drag-area">
      <span className="drag-title">🍅 番茄钟</span>
      <WindowControls />
    </div>
  );
}

function WindowControls() {
  const handleClose = async () => {
    try {
      const appWindow = Window.getCurrent();
      await appWindow.close();
    } catch {
      // ignore
    }
  };

  return (
    <div className="window-controls">
      <button className="win-btn close-btn" onClick={handleClose} title="关闭">
        ✕
      </button>
    </div>
  );
}
