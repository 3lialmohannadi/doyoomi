// ─── Do.Yoomi React Native — فهرس التصدير ────────────────────────────────────
//
// انسخ مجلد yoomi-rn/ إلى مشروعك ثم استورد منه:
//   import { HomeScreen, theme, GRADIENT_H } from './yoomi-rn';
//
// ─────────────────────────────────────────────────────────────────────────────

// Design system
export * from './theme';
export { BottomNav }         from './BottomNav';
export type { TabKey }       from './BottomNav';

// Auth / Onboarding screens
export { SplashScreen }      from './SplashScreen';
export { OnboardingScreen }  from './OnboardingScreen';
export { LoginScreen }       from './LoginScreen';

// Main screens
export { HomeScreen }        from './HomeScreen';
export { TasksScreen }       from './TasksScreen';
export { HabitsScreen }      from './HabitsScreen';
export { GoalsScreen }       from './GoalsScreen';
export { JournalScreen }     from './JournalScreen';
export { CalendarScreen }    from './CalendarScreen';
export { MoreScreen }        from './MoreScreen';

// Secondary screens (navigate to from MoreScreen / tabs)
export { ProfileScreen }        from './ProfileScreen';
export { NotificationsScreen }  from './NotificationsScreen';
export { SupportScreen }        from './SupportScreen';

// Modals / Bottom Sheets
export { DatePickerModal }   from './DatePickerModal';
export { AddTaskSheet }      from './AddTaskSheet';
export { JournalEntrySheet } from './JournalEntrySheet';
