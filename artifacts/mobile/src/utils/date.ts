import { format, isToday, isYesterday, isTomorrow, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Language, StartOfWeek } from '../types';

export const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

export const AR_DAYS_SHORT_SUN = ['أح','اث','ثل','أر','خم','جم','سب'];
export const AR_DAYS_SHORT_MON = ['اث','ثل','أر','خم','جم','سب','أح'];
export const EN_DAYS_SHORT_SUN = ['Su','Mo','Tu','We','Th','Fr','Sa'];
export const EN_DAYS_SHORT_MON = ['Mo','Tu','We','Th','Fr','Sa','Su'];
export const AR_DAYS_FULL = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

export function formatDate(dateStr: string, lang: Language): string {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return lang === 'ar' ? 'اليوم' : 'Today';
    if (isYesterday(date)) return lang === 'ar' ? 'أمس' : 'Yesterday';
    if (isTomorrow(date)) return lang === 'ar' ? 'غداً' : 'Tomorrow';
    if (lang === 'ar') {
      return `${date.getDate()} ${AR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string, lang: Language): string {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return lang === 'ar' ? 'اليوم' : 'Today';
    if (isYesterday(date)) return lang === 'ar' ? 'أمس' : 'Yesterday';
    if (isTomorrow(date)) return lang === 'ar' ? 'غداً' : 'Tomorrow';
    if (lang === 'ar') {
      return `${date.getDate()} ${AR_MONTHS[date.getMonth()]}`;
    }
    return format(date, 'MMM d');
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr: string, format12h: boolean): string {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (format12h) {
      const h = hours % 12 || 12;
      const ampm = hours < 12 ? 'AM' : 'PM';
      return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`;
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  } catch {
    return timeStr;
  }
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getWeekDays(startOfWeekPref: StartOfWeek): Date[] {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: startOfWeekPref === 'sunday' ? 0 : 1 });
  const end = endOfWeek(now, { weekStartsOn: startOfWeekPref === 'sunday' ? 0 : 1 });
  return eachDayOfInterval({ start, end });
}

export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getDayLabel(date: Date, lang: Language): string {
  const days = lang === 'ar'
    ? ['أحد', 'إثن', 'ثلث', 'أرب', 'خمس', 'جمع', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  try {
    const date = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  } catch {
    return false;
  }
}
