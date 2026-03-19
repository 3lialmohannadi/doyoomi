export async function requestNotificationPermission(): Promise<boolean> {
  return false;
}

export async function scheduleTaskReminder(_timeStr: string, _lang: 'en' | 'ar') {}

export async function scheduleHabitReminder(_timeStr: string, _lang: 'en' | 'ar') {}

export async function cancelAllReminders() {}

export async function scheduleAllReminders(
  _taskTime: string,
  _habitTime: string,
  _lang: 'en' | 'ar',
) {}
