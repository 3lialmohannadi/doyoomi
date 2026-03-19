import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskStatus, Subtask, RecurrenceType } from '../types';
import { format, addDays, addWeeks, addMonths, parseISO, getDay } from 'date-fns';
import { createDemoTasks } from '../utils/demoData';

const SETTINGS_KEY = '@doyoomi_settings';

function getNextRecurringDate(dueDate: string, recurrenceType: RecurrenceType): string {
  const base = parseISO(dueDate);
  if (recurrenceType === 'daily') {
    return format(addDays(base, 1), 'yyyy-MM-dd');
  }
  if (recurrenceType === 'weekdays') {
    let next = addDays(base, 1);
    while (getDay(next) === 0 || getDay(next) === 6) {
      next = addDays(next, 1);
    }
    return format(next, 'yyyy-MM-dd');
  }
  if (recurrenceType === 'weekly') {
    return format(addWeeks(base, 1), 'yyyy-MM-dd');
  }
  if (recurrenceType === 'monthly') {
    return format(addMonths(base, 1), 'yyyy-MM-dd');
  }
  return format(addDays(base, 1), 'yyyy-MM-dd');
}

interface TasksState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  postponeTask: (id: string) => void;
  cancelTask: (id: string) => void;
  clearCompleted: () => void;
  addSubtask: (taskId: string, text: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;
  loadTasks: () => Promise<void>;
}

const STORAGE_KEY = '@doyoomi_tasks';
const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],

  addTask: (task) => {
    const realTask: Task = {
      ...task,
      id: genId(),
      user_id: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const withoutDemo = get().tasks.filter(t => !t.is_demo);
    const updated = [realTask, ...withoutDemo];
    set({ tasks: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateTask: (id, updates) => {
    const updated = get().tasks.map(t =>
      t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
    );
    set({ tasks: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteTask: (id) => {
    const updated = get().tasks.filter(t => t.id !== id);
    set({ tasks: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  toggleComplete: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';

    get().updateTask(id, {
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined,
    });

    if (newStatus === 'completed' && task.recurrence && task.due_date) {
      const nextDate = getNextRecurringDate(task.due_date, task.recurrence.type);
      const nextTask: Task = {
        ...task,
        id: genId(),
        status: 'pending',
        completed_at: undefined,
        due_date: nextDate,
        subtasks: task.subtasks?.map(s => ({ ...s, done: false })),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const withNext = [nextTask, ...get().tasks];
      set({ tasks: withNext });
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(withNext));
    }
  },

  postponeTask: (id) => {
    get().updateTask(id, { status: 'postponed' });
  },

  cancelTask: (id) => {
    get().updateTask(id, { status: 'cancelled' });
  },

  clearCompleted: () => {
    const updated = get().tasks.filter(t => t.status !== 'completed');
    set({ tasks: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  addSubtask: (taskId, text) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;
    const newSubtask: Subtask = { id: genId(), text, done: false };
    const subtasks = [...(task.subtasks ?? []), newSubtask];
    get().updateTask(taskId, { subtasks });
  },

  toggleSubtask: (taskId, subtaskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;
    const subtasks = (task.subtasks ?? []).map(s =>
      s.id === subtaskId ? { ...s, done: !s.done } : s
    );
    get().updateTask(taskId, { subtasks });
  },

  removeSubtask: (taskId, subtaskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;
    const subtasks = (task.subtasks ?? []).filter(s => s.id !== subtaskId);
    get().updateTask(taskId, { subtasks });
  },

  loadTasks: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ tasks: JSON.parse(stored) });
        return;
      }
      const settingsRaw = await AsyncStorage.getItem(SETTINGS_KEY);
      const settings = settingsRaw ? JSON.parse(settingsRaw) : null;
      const onboardingComplete = settings?.onboarding_complete === true;
      if (!onboardingComplete) {
        const demo = createDemoTasks();
        set({ tasks: demo });
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      }
    } catch {}
  },
}));
