import { Language } from '../types';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    home: 'Home',
    calendar: 'Calendar',
    tasks: 'Tasks',
    goals: 'Goals',
    settings: 'Settings',
    habits: 'Habits',
    more: 'More',

    // Filters
    filters: 'Filters',
    filterBy: 'Filter by',

    // More page sections
    account: 'Account',
    preferences: 'Preferences',
    helpSection: 'Help',
    content: 'Content',

    // Greetings
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',

    // Home stats
    completed: 'Done',
    overdue: 'Late',
    thisWeek: 'This week',
    streak: 'Streak',
    days: 'days',

    // Celebration
    allDoneToday: 'All done for today!',
    allDoneSubtitle: "You've completed every task today. Keep it up!",

    // Sections
    goalsSection: 'Goals',
    weeklyAchievement: 'Weekly Achievement',
    today2: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',

    // Calendar views
    month: 'Month',
    week: 'Week',
    day: 'Day',
    noTasksToday: 'No tasks for this day',

    // Task actions
    addTask: 'Add Task',
    addNew: 'Add',
    markComplete: 'Mark done',
    postpone: 'Postpone',
    deleteTask: 'Delete task',
    editTask: 'Edit task',
    noTasks: 'No tasks yet',
    noTasksSubtitle: 'Add your first task and start your day right',
    noSearchResults: 'No tasks match your search',
    search: 'Search tasks...',

    // Filters
    all: 'All',
    today: 'Today',
    done: 'Done',
    high: 'High',
    postponed: 'Postponed',
    pending: 'Pending',
    cancelled: 'Cancelled',
    low: 'Low',
    medium: 'Medium',

    // Goals
    addGoal: 'Add Goal',
    editGoal: 'Edit Goal',
    deleteGoal: 'Delete Goal',
    noGoals: 'No goals yet',
    noGoalsSubtitle: 'Set your first goal and start making progress',
    activeGoals: 'active goals',
    goalType: 'Type',
    targetValue: 'Target',
    currentValue: 'Current',
    progress: 'Progress',
    monthly: 'Monthly',
    yearly: 'Yearly',

    // Habits
    addHabit: 'Add Habit',
    editHabit: 'Edit Habit',
    deleteHabit: 'Delete Habit',
    noHabits: 'No habits yet',
    noHabitsSubtitle: 'Start a habit and track your daily progress',
    habitName: 'Habit name',
    completeHabit: 'Mark done',
    activeHabits: 'active habits',
    doneToday: 'Done today',

    // Settings
    profile: 'Profile',
    noNameSet: 'No name set',
    tapToEditProfile: 'Tap to edit profile',
    language: 'Language',
    theme: 'Theme',
    timeFormat: 'Time format',
    startOfWeek: 'Start of week',
    categories: 'Categories',
    about: 'About',
    version: 'Version',
    yourDayYourWay: 'Your Day, Your Way.',
    appSettings: 'App Settings',
    organization: 'Organization',
    light: 'Light',
    dark: 'Dark',
    monday: 'Monday',
    sunday: 'Sunday',
    hour12: '12h',
    hour24: '24h',
    english: 'English',
    arabic: 'عربي',

    // Support / Contact
    support: 'Support',
    supportAndContact: 'Support & Contact',
    supportSubtitle: 'We\'d love to hear from you',
    supportCategory: 'Category',
    suggestion: 'Suggestion',
    technicalIssue: 'Technical Issue',
    other: 'Other',
    supportSubjectField: 'Subject',
    supportSubjectPlaceholder: 'Enter your subject...',
    supportMessage: 'Message',
    supportMessagePlaceholder: 'Describe your issue or suggestion...',
    sendMessage: 'Send Message',
    messagePrepared: 'Message Ready!',
    messagePreparedDesc: 'Your mail app will open. Review and tap send to deliver your message.',
    mailFailed: 'Could Not Open Mail',
    mailFailedDesc: 'Please send your message directly to:',
    sendAnother: 'Send Another Message',
    tryAgain: 'Try Again',
    fieldRequired: 'This field is required',

    // Chart
    chartDone: 'Done',
    chartTotal: 'Total',

    // Misc
    taskCount: 'tasks',
    noTasksThisDay: 'No tasks this day',

    // Form elements
    icon: 'Icon',
    color: 'Color',
    none: 'None',
    taskTitlePlaceholder: 'Task title',
    descriptionPlaceholder: 'Add a description...',
    datePlaceholder: 'YYYY-MM-DD',
    timePlaceholder: 'HH:MM',
    goalTitlePlaceholder: 'Goal title',
    goalDescPlaceholder: 'Description...',
    habitNamePlaceholder: 'Habit name',

    // Form
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    dateOfBirth: 'Date of Birth',
    personalInfo: 'Personal Info',
    contactInfo: 'Contact Info',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    phonePlaceholder: '+974 5XXX XXXX',
    dobPlaceholder: 'Select date of birth',
    title: 'Title',
    description: 'Description (optional)',
    date: 'Date',
    time: 'Time',
    priority: 'Priority',
    category: 'Category',
    noDate: 'No Date',
    message: 'Message',

    // Journal
    journal: 'Daily Journal',
    addEntry: 'New Entry',
    editEntry: 'Edit Entry',
    deleteEntry: 'Delete Entry',
    back: 'Back',
    next: 'Next',
    entryDeleted: 'Journal entry deleted',
    habitCompleted: 'Great job! Habit completed.',
    habitUncompleted: 'Habit unmarked',
    habitDeleted: 'Habit deleted',
    goalDeleted: 'Goal deleted',
    taskCompleted: 'Task done! Keep it up.',
    taskDeleted: 'Task deleted',
    areYouSure: 'Are you sure?',
    cannotUndo: 'This cannot be undone.',
    confirm: 'Confirm',
    noEntries: 'No entries yet',
    noEntriesSubtitle: 'Capture your thoughts, mood, and moments each day',
    entryTitle: 'Title (optional)',
    entryContent: 'Content',
    entryTitlePlaceholder: 'Give this entry a title...',
    entryContentPlaceholder: "What's on your mind today?",
    mood: 'Mood',
    moodExcellent: 'Excellent',
    moodVeryGood: 'Very Good',
    moodGood: 'Good',
    moodNeutral: 'Neutral',
    moodTired: 'Tired',
    moodStressed: 'Stressed',
    moodSad: 'Sad',
    moodBad: 'Bad',
    tags: 'Tags',
    tagsPlaceholder: 'Add tags (comma separated)',
    todayEntry: "Today's Entry",
    noEntryToday: "No entry for today yet",
    startWriting: 'Write Today',
    searchEntries: 'Search entries...',
    entries: 'entries',

    // Quick Add menu
    quickAdd: 'Quick Add',
    quickAddTask: 'New task',
    quickAddHabit: 'New habit',
    quickAddGoal: 'New goal',
    quickAddJournal: 'Daily journal',
    noHabitsYet: 'No habits yet',
    tapPlusToAdd: 'Tap Add to start your first habit',
    noGoalsYet: 'No goals yet',
    tapPlusToAddGoal: 'Tap Add to set your first goal',
    noTasksForDay: 'Nothing planned for this day',
    tapToAddTask: 'Tap Add to plan your day',

    // Time picker
    hourLabel: 'Hour',
    minLabel: 'Min',

    // Categories
    addCategoryHint: 'Add a category to organize your tasks',
    categoryNamePlaceholder: 'Category name',
    preview: 'Preview',

    // Count labels
    habitCount: 'habits',
    goalCount: 'goals',
    entryCount: 'entries',
    categoryCount: 'categories',
    weAreHereToHelp: 'We are here to help',
  },

  ar: {
    // التنقل
    home: 'الرئيسية',
    calendar: 'التقويم',
    tasks: 'المهام',
    goals: 'الأهداف',
    settings: 'الإعدادات',
    habits: 'العادات',
    more: 'المزيد',

    // الفلاتر
    filters: 'الفلاتر',
    filterBy: 'تصفية حسب',

    // قسم المزيد
    account: 'الحساب',
    preferences: 'التفضيلات',
    helpSection: 'المساعدة',
    content: 'المحتوى',

    // التحيات
    goodMorning: 'صباح الخير',
    goodAfternoon: 'مساء الخير',
    goodEvening: 'مساء النور',

    // إحصائيات الرئيسية
    completed: 'مكتمل',
    overdue: 'متأخر',
    thisWeek: 'هذا الأسبوع',
    streak: 'التسلسل',
    days: 'أيام',

    // الاحتفال
    allDoneToday: 'أنجزت كل مهامك اليوم!',
    allDoneSubtitle: 'أتممت جميع مهامك اليوم. استمر على هذا النهج!',

    // الأقسام
    goalsSection: 'الأهداف',
    weeklyAchievement: 'الإنجاز الأسبوعي',
    today2: 'اليوم',
    yesterday: 'أمس',
    tomorrow: 'غداً',

    // عروض التقويم
    month: 'شهر',
    week: 'أسبوع',
    day: 'يوم',
    noTasksToday: 'لا توجد مهام لهذا اليوم',

    // إجراءات المهام
    addTask: 'إضافة مهمة',
    addNew: 'إضافة',
    markComplete: 'تعيين منجز',
    postpone: 'تأجيل',
    deleteTask: 'حذف المهمة',
    editTask: 'تعديل المهمة',
    noTasks: 'لا توجد مهام بعد',
    noTasksSubtitle: 'أضف مهمتك الأولى وابدأ يومك بشكل صحيح',
    noSearchResults: 'لا توجد مهام تطابق بحثك',
    search: 'ابحث في المهام...',

    // الفلاتر
    all: 'الكل',
    today: 'اليوم',
    done: 'منجز',
    high: 'عالي',
    postponed: 'مؤجل',
    pending: 'قيد الانتظار',
    cancelled: 'ملغى',
    low: 'منخفض',
    medium: 'متوسط',

    // الأهداف
    addGoal: 'إضافة هدف',
    editGoal: 'تعديل الهدف',
    deleteGoal: 'حذف الهدف',
    noGoals: 'لا توجد أهداف بعد',
    noGoalsSubtitle: 'حدد أول هدف لك وابدأ رحلة التحقيق',
    activeGoals: 'أهداف نشطة',
    goalType: 'النوع',
    targetValue: 'الهدف',
    currentValue: 'الحالي',
    progress: 'التقدم',
    monthly: 'شهري',
    yearly: 'سنوي',

    // العادات
    addHabit: 'إضافة عادة',
    editHabit: 'تعديل العادة',
    deleteHabit: 'حذف العادة',
    noHabits: 'لا توجد عادات بعد',
    noHabitsSubtitle: 'ابدأ عادة وتتبع تقدمك اليومي',
    habitName: 'اسم العادة',
    completeHabit: 'تعيين منجز',
    activeHabits: 'عادات نشطة',
    doneToday: 'أُنجز اليوم',

    // الإعدادات
    profile: 'الملف الشخصي',
    noNameSet: 'لم يُحدد اسم بعد',
    tapToEditProfile: 'اضغط لتعديل ملفك الشخصي',
    language: 'اللغة',
    theme: 'المظهر',
    timeFormat: 'تنسيق الوقت',
    startOfWeek: 'بداية الأسبوع',
    categories: 'الفئات',
    about: 'حول التطبيق',
    version: 'الإصدار',
    yourDayYourWay: 'يومك، بطريقتك.',
    appSettings: 'إعدادات التطبيق',
    organization: 'التنظيم',
    light: 'فاتح',
    dark: 'داكن',
    monday: 'الاثنين',
    sunday: 'الأحد',
    hour12: '12 ساعة',
    hour24: '24 ساعة',
    english: 'English',
    arabic: 'عربي',

    // الدعم والتواصل
    support: 'الدعم',
    supportAndContact: 'الدعم والتواصل',
    supportSubtitle: 'يسعدنا سماع رأيك',
    supportCategory: 'الفئة',
    suggestion: 'اقتراح',
    technicalIssue: 'مشكلة تقنية',
    other: 'أخرى',
    supportSubjectField: 'الموضوع',
    supportSubjectPlaceholder: 'أدخل موضوع رسالتك...',
    supportMessage: 'الرسالة',
    supportMessagePlaceholder: 'اشرح مشكلتك أو اقتراحك...',
    sendMessage: 'إرسال الرسالة',
    messagePrepared: 'الرسالة جاهزة!',
    messagePreparedDesc: 'سيفتح تطبيق البريد. راجع الرسالة ثم أرسلها.',
    mailFailed: 'تعذّر فتح البريد',
    mailFailedDesc: 'يرجى إرسال رسالتك مباشرةً إلى:',
    sendAnother: 'إرسال رسالة أخرى',
    tryAgain: 'حاول مجدداً',
    fieldRequired: 'هذا الحقل مطلوب',

    // الرسم البياني
    chartDone: 'منجز',
    chartTotal: 'الإجمالي',

    // متفرقات
    taskCount: 'مهام',
    noTasksThisDay: 'لا توجد مهام لهذا اليوم',

    // عناصر النماذج
    icon: 'الأيقونة',
    color: 'اللون',
    none: 'بدون',
    taskTitlePlaceholder: 'عنوان المهمة',
    descriptionPlaceholder: 'أضف وصفاً...',
    datePlaceholder: 'اختر التاريخ',
    timePlaceholder: 'HH:MM',
    goalTitlePlaceholder: 'عنوان الهدف',
    goalDescPlaceholder: 'الوصف...',
    habitNamePlaceholder: 'اسم العادة',

    // النماذج
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    dateOfBirth: 'تاريخ الميلاد',
    personalInfo: 'المعلومات الشخصية',
    contactInfo: 'معلومات التواصل',
    namePlaceholder: 'اسمك',
    emailPlaceholder: 'بريدك@الإلكتروني.com',
    phonePlaceholder: '+974 5XXX XXXX',
    dobPlaceholder: 'اختر تاريخ الميلاد',
    title: 'العنوان',
    description: 'الوصف (اختياري)',
    date: 'التاريخ',
    time: 'الوقت',
    priority: 'الأولوية',
    category: 'الفئة',
    noDate: 'بدون تاريخ',
    message: 'الرسالة',

    // اليومية
    journal: 'مذكرات يومية',
    addEntry: 'إدخال جديد',
    editEntry: 'تعديل الإدخال',
    deleteEntry: 'حذف الإدخال',
    back: 'رجوع',
    next: 'التالي',
    entryDeleted: 'تم حذف الإدخال من المذكرة',
    habitCompleted: 'أحسنت! تم إنجاز العادة.',
    habitUncompleted: 'تم إلغاء تعيين العادة',
    habitDeleted: 'تم حذف العادة',
    goalDeleted: 'تم حذف الهدف',
    taskCompleted: 'أحسنت! تمت المهمة.',
    taskDeleted: 'تم حذف المهمة',
    areYouSure: 'هل أنت متأكد؟',
    cannotUndo: 'لا يمكن التراجع عن هذا.',
    confirm: 'تأكيد',
    noEntries: 'لا توجد إدخالات بعد',
    noEntriesSubtitle: 'دوّن أفكارك ومزاجك ولحظاتك كل يوم',
    entryTitle: 'العنوان (اختياري)',
    entryContent: 'المحتوى',
    entryTitlePlaceholder: 'أعط هذا الإدخال عنواناً...',
    entryContentPlaceholder: 'ماذا يدور في ذهنك اليوم؟',
    mood: 'المزاج',
    moodExcellent: 'ممتاز',
    moodVeryGood: 'جيد جداً',
    moodGood: 'جيد',
    moodNeutral: 'عادي',
    moodTired: 'متعب',
    moodStressed: 'متوتر',
    moodSad: 'حزين',
    moodBad: 'سيئ',
    tags: 'الوسوم',
    tagsPlaceholder: 'أضف وسوم (مفصولة بفاصلة)',
    todayEntry: 'إدخال اليوم',
    noEntryToday: 'لم تكتب لليوم بعد',
    startWriting: 'اكتب اليوم',
    searchEntries: 'ابحث في الإدخالات...',
    entries: 'إدخالات',

    // قائمة الإضافة السريعة
    quickAdd: 'إضافة سريعة',
    quickAddTask: 'مهمة جديدة',
    quickAddHabit: 'عادة جديدة',
    quickAddGoal: 'هدف جديد',
    quickAddJournal: 'مذكرة يومية',
    noHabitsYet: 'لا توجد عادات بعد',
    tapPlusToAdd: 'اضغط إضافة لتبدأ أول عادة لك',
    noGoalsYet: 'لا توجد أهداف بعد',
    tapPlusToAddGoal: 'اضغط إضافة لتحديد أول هدف لك',
    noTasksForDay: 'لا يوجد شيء مخطط لهذا اليوم',
    tapToAddTask: 'اضغط إضافة لتخطيط يومك',

    // منتقي الوقت
    hourLabel: 'ساعة',
    minLabel: 'دقيقة',

    // الفئات
    addCategoryHint: 'أضف فئة لتنظيم مهامك',
    categoryNamePlaceholder: 'اسم الفئة',
    preview: 'معاينة',

    // تسميات العدد
    habitCount: 'عادة',
    goalCount: 'هدف',
    entryCount: 'إدخال',
    categoryCount: 'تصنيف',
    weAreHereToHelp: 'نحن هنا للمساعدة',
  },
};

export function t(key: string, lang: Language): string {
  return translations[lang][key] ?? translations['en'][key] ?? key;
}

export function getGreeting(lang: Language): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('goodMorning', lang);
  if (hour < 18) return t('goodAfternoon', lang);
  return t('goodEvening', lang);
}
