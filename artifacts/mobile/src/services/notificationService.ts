import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleTaskReminder(timeStr: string, lang: 'en' | 'ar') {
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

  await Notifications.cancelScheduledNotificationAsync('task-daily').catch(() => {});

  const title = lang === 'ar' ? 'تذكير المهام 📋' : 'Task Reminder 📋';
  const body = lang === 'ar'
    ? 'لا تنسَ مراجعة مهامك لليوم!'
    : "Don't forget to check your tasks for today!";

  await Notifications.scheduleNotificationAsync({
    identifier: 'task-daily',
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function scheduleHabitReminder(timeStr: string, lang: 'en' | 'ar') {
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);

  await Notifications.cancelScheduledNotificationAsync('habit-daily').catch(() => {});

  const title = lang === 'ar' ? 'تحقق العادات ✅' : 'Habit Check-in ✅';
  const body = lang === 'ar'
    ? 'حان وقت إتمام عادات اليوم والحفاظ على سلسلتك!'
    : "Time to complete today's habits and keep your streak!";

  await Notifications.scheduleNotificationAsync({
    identifier: 'habit-daily',
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleAllReminders(
  taskTime: string,
  habitTime: string,
  lang: 'en' | 'ar',
) {
  await scheduleTaskReminder(taskTime, lang);
  await scheduleHabitReminder(habitTime, lang);
}
