import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Priority, TaskStatus } from '../types';
import { format, addDays, subDays } from 'date-fns';

const today = format(new Date(), 'yyyy-MM-dd');
const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');

const MOCK_TASKS: Task[] = [
  {
    id: 't-1', user_id: 'user-1',
    title: 'Review Q4 strategy deck',
    description: 'Go through the slides and add feedback before the meeting',
    due_date: today, due_time: '09:30',
    priority: 'high', status: 'pending',
    category_id: 'cat-1', is_all_day: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't-2', user_id: 'user-1',
    title: 'Morning workout',
    due_date: today, due_time: '07:00',
    priority: 'medium', status: 'completed',
    category_id: 'cat-3', is_all_day: false,
    completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't-3', user_id: 'user-1',
    title: 'Read 30 minutes',
    description: 'Continue "Atomic Habits"',
    due_date: today,
    priority: 'low', status: 'pending',
    category_id: 'cat-4', is_all_day: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't-4', user_id: 'user-1',
    title: 'Pay electricity bill',
    due_date: twoDaysAgo,
    priority: 'high', status: 'overdue',
    category_id: 'cat-5', is_all_day: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't-5', user_id: 'user-1',
    title: 'Call mom',
    due_date: yesterday,
    priority: 'medium', status: 'postponed',
    category_id: 'cat-2', is_all_day: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't-6', user_id: 'user-1',
    title: 'Doctor appointment',
    description: 'Annual checkup at City Health Clinic',
    due_date: tomorrow, due_time: '14:00',
    priority: 'high', status: 'pending',
    category_id: 'cat-3', is_all_day: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't-7', user_id: 'user-1',
    title: 'Weekly team standup',
    due_date: today, due_time: '10:00',
    priority: 'medium', status: 'pending',
    category_id: 'cat-1', is_all_day: false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 't-8', user_id: 'user-1',
    title: 'Buy groceries',
    priority: 'low', status: 'pending',
    category_id: 'cat-2', is_all_day: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

interface TasksState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  postponeTask: (id: string) => void;
  loadTasks: () => Promise<void>;
}

const STORAGE_KEY = '@doyoomi_tasks';
const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: MOCK_TASKS,

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: genId(),
      user_id: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newTask, ...get().tasks];
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
  },

  postponeTask: (id) => {
    get().updateTask(id, { status: 'postponed' });
  },

  loadTasks: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) set({ tasks: JSON.parse(stored) });
    } catch {}
  },
}));
