export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed' | 'overdue' | 'postponed' | 'cancelled';
export type GoalType = 'monthly' | 'yearly';
export type Mood = 'excellent' | 'good' | 'neutral' | 'tired' | 'bad';
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
export type TimeFormat = '12h' | '24h';
export type StartOfWeek = 'monday' | 'sunday';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  language: Language;
  theme: Theme;
  time_format: TimeFormat;
  start_of_week: StartOfWeek;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  due_time?: string;
  priority: Priority;
  status: TaskStatus;
  category_id?: string;
  reminder_at?: string;
  is_all_day: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: GoalType;
  target_value: number;
  current_value: number;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  streak_days: number;
  last_completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title?: string;
  content: string;
  mood?: Mood;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
