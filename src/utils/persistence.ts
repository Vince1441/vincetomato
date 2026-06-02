import { invoke } from '@tauri-apps/api/core';
import { useStore, DEFAULT_SETTINGS } from '../store';
import { AppSettings, Task, Record } from '../types';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export async function readFile(filename: string): Promise<string> {
  try {
    return await invoke<string>('read_json_file', { filename });
  } catch (e) {
    console.error(`Failed to read ${filename}:`, e);
    return '';
  }
}

export async function writeFile(filename: string, content: string): Promise<void> {
  try {
    await invoke('write_json_file', { filename, content });
  } catch (e) {
    console.error(`Failed to write ${filename}:`, e);
  }
}

export async function loadData() {
  const settingsRaw = await readFile('settings.json');
  const tasksRaw = await readFile('tasks.json');
  const recordsRaw = await readFile('records.json');

  const settings: AppSettings = settingsRaw
    ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsRaw) }
    : DEFAULT_SETTINGS;

  const tasks: Task[] = tasksRaw ? JSON.parse(tasksRaw) : [];
  const records: Record[] = recordsRaw ? JSON.parse(recordsRaw) : [];

  useStore.getState().initStore(settings, tasks, records);
}

export function saveDataDebounced(
  settings: AppSettings,
  tasks: Task[],
  records: Record[]
) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    writeFile('settings.json', JSON.stringify(settings, null, 2));
    writeFile('tasks.json', JSON.stringify(tasks, null, 2));
    writeFile('records.json', JSON.stringify(records, null, 2));
  }, 500);
}
