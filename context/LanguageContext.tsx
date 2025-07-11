import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
};

const translations = {
  ar: {
    // Common
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    back: 'رجوع',
    continue: 'متابعة',
    loading: 'جاري التحميل...',

    // Navigation
    home: 'الرئيسية',
    create: 'إنشاء',
    history: 'السجل',
    settings: 'الإعدادات',

    // Home Screen
    makeWiserChoices: 'اتخذ قرارات أكثر حكمة',
    compareOptions: 'قارن الخيارات. قيم المعايير. قرر بثقة.',
    startNewDecision: 'ابدأ قراراً جديداً',
    compareOptionsSubtitle: 'قارن الخيارات واتخذ قراراً',
    recentDecisions: 'القرارات الأخيرة',
    viewAll: 'عرض الكل',
    noRecentDecisions: 'لا توجد قرارات حديثة',
    startFirstDecision: 'ابدأ عملية اتخاذ القرار الأولى بالنقر على الزر أعلاه.',
    decisionTips: 'نصائح اتخاذ القرار',
    tip1: 'حدد معايير واضحة تهم قرارك',
    tip2: 'كن صادقاً في تقييماتك - لا تدع التحيز يؤثر على اختيارك',
    tip3: 'ضع في اعتبارك العوامل الموضوعية واستجابتك العاطفية',

    // Create/Edit Screen
    defineDecision: 'حدد قرارك',
    decisionTitle: 'عنوان القرار',
    optional: 'اختياري',
    decisionTitlePlaceholder: 'مثال: أي عرض وظيفي يجب أن أقبل؟',
    description: 'الوصف',
    descriptionPlaceholder: 'أضف المزيد من التفاصيل حول قرارك...',
    optionsToCompare: 'الخيارات للمقارنة',
    addAtLeastTwo: 'أضف خيارين على الأقل',
    addOption: 'إضافة خيار',
    standard: 'المعيار',
    option: 'الخيار',
    total: ' المجموع',
    standards: 'المعايير',
    recommendation: "ينصح بتحسينه بنسبة",
    recommendations: "إن أردت تطوير بعض المعايير إليك التوصيات",
    bestOption: "الخيار الأفضل لك هو: ",
    allCompletedStandar: "جميع المعايير مكتملة لهذا الخيار، لا توجد توصيات.",
    completedStandar: "(مكتمل)",
    defineCriteria: 'حدد المعايير',
    criteriaDescription: 'ما هي العوامل المهمة في اتخاذ هذا القرار؟',
    addCriterion: 'إضافة معيار',
    criterionPlaceholder: 'المعيار (مثال: الراتب، الموقع)',
    rateOptions: 'قيم الخيارات',
    criteriaHint: 'نصيحة: قم بتعيين أوزان للمعايير بناءً على أهميتها لقرارك',
    ratingHint: 'نصيحة: كن صادقاً في تقييماتك - لا تدع التحيز يؤثر على اختيارك',
    rateDescription: 'قيم كل خيار من 1-10 لكل معيار',
    viewResults: 'عرض النتائج',

    // Results Screen
    results: 'النتائج',
    result: 'النتيجة',
    detailedBreakdown: 'تحليل مفصل',
    decisionNotFound: 'لم يتم العثور على القرار',
    goBack: 'رجوع',
    clearChoice: '{option} هو خيارك الواضح',
    narrowMargin: '{option}  هو الأفضل بفارق ضئيل ',
    betterBy: '{option} أفضل بـ {points} نقطة ({percent}٪)',
    decisivelyBetter: '{option} أفضل بشكل حاسم بـ {points} نقطة',
    optionsEqual: 'كل الخيارات متساوية',
    optionsSomeEqual: '{option}  متعادل في الترتيب مع خيارات أخرى',
    place1: 'الخيار الأول - ',
    place2: 'الخيار الثاني - ',
    place3: 'الخيار الثالث - ',
    reportbody: 'التقرير',
    shareMessage: 'استخدمت قراري لمساعدتي في اتخاذ قرار "{title}" وكانت النتيجة: {result}! قم بتجربة التطبيق الآن https://coruscating-palmier-8d0016.netlify.app/',
    shareTitle: 'قراري في قراري ',
    aiInsights: 'تحليل الذكاء الاصطناعي',
    generateInsights: 'توليد التحليل',
    generatingInsights: 'جاري توليد التحليل...',
    insightsPlaceholder: 'قم بتوليد تحليل مدعوم بالذكاء الاصطناعي بناءً على بيانات قرارك للحصول على فهم أعمق لخياراتك.',
    copyInsights: 'نسخ التحليل',
    insightsCopied: 'تم نسخ التحليل إلى الحافظة',
    editDecision: 'تعديل القرار',
    newDecision: 'قرار جديد',
    printReport: 'طباعة التقرير',

    // Settings Screen
    appearance: 'المظهر',
    darkMode: 'الوضع الداكن',
    language: 'اللغة',
    english: 'الإنجليزية',
    arabic: 'العربية',
    dataManagement: 'إدارة البيانات',
    clearData: 'مسح جميع البيانات',
    clearDataDesc: 'سيؤدي هذا إلى حذف جميع قراراتك المحفوظة بشكل دائم.',
    clearDataTitle: 'مسح جميع البيانات',
    clearDataConfirm: 'هل أنت متأكد أنك تريد حذف جميع بيانات قراراتك؟ لا يمكن التراجع عن هذا الإجراء.',
    success: 'نجاح',
    dataCleared: 'تم مسح جميع بيانات القرارات',
    error: 'خطأ',
    errorClearingData: 'حدث خطأ أثناء مسح البيانات',
    about: 'حول',
    version: 'الإصدار',
    decisionDetails: 'تفاصيل القرار',
    saveChanges: 'حفظ التغييرات',
    cannotRemove: 'لا يمكن الحذف',
    needOneOption: 'تحتاج إلى خيار واحد على الأقل',
    needOneCriterion: 'تحتاج إلى معيار واحد على الأقل',
    missingInformation: 'معلومات ناقصة',
    enterTitle: 'الرجاء إدخال عنوان للقرار',
    enterTwoOptions: 'الرجاء إدخال خيارين على الأقل',
    enterOneCriterion: 'الرجاء إدخال معيار واحد على الأقل',
    incompleteRatings: 'تقييمات غير مكتملة',
    rateAllOptions: 'الرجاء تقييم جميع الخيارات لكل معيار',
    errorLoadingDecision: 'حدث خطأ أثناء تحميل القرار',
    errorUpdatingDecision: 'حدث خطأ أثناء تحديث القرار',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    copyright: 'جميع الحقوق محفوظة © 2025  قراري',
    tagline: 'د. يوسف بن هليل الجابري',
    privacyPolicyContent: 'في قراري، نأخذ خصوصيتك على محمل الجد. نحن نجمع ونخزن فقط البيانات الضرورية لعمل التطبيق. يتم تخزين قراراتك محليًا على جهازك ولا تتم مشاركتها مع أي طرف ثالث. نحن لا نتتبع استخدامك أو نجمع أي معلومات شخصية تتجاوز ما هو ضروري تمامًا لعمل التطبيق.\n\nنحن نستخدم إجراءات أمنية قياسية لحماية بياناتك، ولكن يرجى ملاحظة أنه لا توجد طريقة تخزين إلكترونية آمنة بنسبة 100٪. باستخدام قراري، فإنك تقر بأنك تفهم وتوافق على هذه الشروط.\n\nإذا كان لديك أي أسئلة حول ممارسات الخصوصية لدينا، يرجى الاتصال بنا.',
    termsOfServiceContent: 'باستخدام قراري، فإنك توافق على شروط الخدمة هذه. يتم تقديم التطبيق "كما هو" دون أي ضمانات، صريحة أو ضمنية. نحتفظ بالحق في تعديل أو إيقاف الخدمة في أي وقت.\n\nأنت مسؤول عن جميع القرارات التي تتخذها باستخدام التطبيق. قراري هو أداة لمساعدتك في تنظيم أفكارك ومقارنة الخيارات، لكن القرار النهائي هو دائمًا قرارك. نحن لسنا مسؤولين عن أي عواقب للقرارات المتخذة باستخدام التطبيق.\n\nأنت توافق على عدم استخدام التطبيق لأي أغراض غير قانونية أو بأي طريقة يمكن أن تضر أو تعطل أو تضعف الخدمة. نحتفظ بالحق في إنهاء وصولك إلى التطبيق إذا انتهكت هذه الشروط.',

    // History Screen
    decisionHistory: 'سجل قراراتك',
    noDecisionsFound: 'لم يتم العثور على قرارات',
    noDecisionsDesc: 'لم تتخذ أي قرارات بعد. ابدأ بإنشاء قرار جديد!',
    tapToDelete: 'انقر على القرارات لحذفها',
    done: 'تم',
  },

  en: {
    // Common
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    continue: 'Continue',
    loading: 'Loading...',

    // Navigation
    home: 'Home',
    create: 'Create',
    history: 'History',
    settings: 'Settings',

    // Home Screen
    makeWiserChoices: 'Make Wiser Choices',
    compareOptions: 'Compare options. Rate criteria. Decide confidently.',
    startNewDecision: 'Start New Decision',
    compareOptionsSubtitle: 'Compare options and make a choice',
    recentDecisions: 'Recent Decisions',
    viewAll: 'View All',
    noRecentDecisions: 'No Recent Decisions',
    startFirstDecision: 'Start your first decision-making process by clicking the button above.',
    decisionTips: 'Decision Making Tips',
    tip1: 'Define clear criteria that matter most to your decision',
    tip2: 'Be honest with your ratings - don\'t let bias influence your choice',
    tip3: 'Consider both objective factors and your emotional response',

    // Create/Edit Screen
    defineDecision: 'Define Your Decision',
    decisionTitle: 'Decision Title',
    optional: 'Optional',
    decisionTitlePlaceholder: 'e.g., Which job offer should I accept?',
    description: 'Description',
    descriptionPlaceholder: 'Add more details about your decision...',
    optionsToCompare: 'Options to Compare',
    addAtLeastTwo: 'Add at least 2 options',
    addOption: 'Add Option',
    standard: 'Standard',
    option: 'Option',
    total: 'the total',
    standards: 'the standards',
    recommendation: "is recommended to improve by",
    recommendations: "If you want to develop some standards, here are the recommendations.",
    bestOption: "The best option for you is: ",
    allCompletedStandar: "All criteria are met for this option, no recommendations.",
    completedStandar: "(completed)",
    defineCriteria: 'Define Your Criteria',
    criteriaDescription: 'What factors are important in making this decision?',
    addCriterion: 'Add Criterion',
    criterionPlaceholder: 'Criterion (e.g., Salary, Location)',
    rateOptions: 'Rate Your Options',
    criteriaHint: 'Tip: Assign weights to criteria based on their importance to your decision',
    ratingHint: 'Tip: Be honest with your ratings - don\'t let bias influence your choice',
    rateDescription: 'Score each option from 1-10 for each criterion',
    viewResults: 'View Results',

    // Results Screen
    results: 'Results',
    result: 'Result',
    detailedBreakdown: 'Detailed Breakdown',
    decisionNotFound: 'Decision not found',
    goBack: 'Go Back',
    clearChoice: '{option} is your clear choice',
    narrowMargin: '{option} wins by a narrow margin',
    betterBy: '{option} is better by {points} points ({percent}%)',
    decisivelyBetter: '{option} is decisively better by {points} points',
    optionsEqual: 'All options are equal.',
    optionsSomeEqual: '{option} is Tied in rank with other options.',
    place1: 'The 1st option - ',
    place2: 'The 2nd option - ',
    place3: 'The 3rd option - ',
    // report 
    reportbody: 'report',
    shareMessage: 'I used qarari to help me decide on "{title}" and the result was: {result}! Try the app now https://coruscating-palmier-8d0016.netlify.app/',
    shareTitle: 'My qarari Decision',
    aiInsights: 'AI Insights',
    generateInsights: 'Generate Insights',
    generatingInsights: 'Generating insights...',
    insightsPlaceholder: 'Generate AI-powered insights based on your decision data to get a deeper understanding of your choices.',
    copyInsights: 'Copy insights',
    insightsCopied: 'Insights copied to clipboard',
    editDecision: 'Edit Decision',
    newDecision: 'New Decision',
    printReport: 'Print Report',

    // Settings Screen
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
    dataManagement: 'Data Management',
    clearData: 'Clear All Data',
    clearDataDesc: 'This will permanently delete all your saved decisions.',
    clearDataTitle: 'Clear All Data',
    clearDataConfirm: 'Are you sure you want to delete all your decision data? This cannot be undone.',
    success: 'Success',
    dataCleared: 'All decision data has been cleared',
    error: 'Error',
    errorClearingData: 'An error occurred while clearing data',
    about: 'About',
    version: 'Version',
    decisionDetails: 'Decision Details',
    saveChanges: 'Save Changes',
    cannotRemove: 'Cannot Remove',
    needOneOption: 'You need at least one option',
    needOneCriterion: 'You need at least one criterion',
    missingInformation: 'Missing Information',
    enterTitle: 'Please enter a title for your decision',
    enterTwoOptions: 'Please enter at least two options',
    enterOneCriterion: 'Please enter at least one criterion',
    incompleteRatings: 'Incomplete Ratings',
    rateAllOptions: 'Please rate all options for each criterion',
    errorLoadingDecision: 'An error occurred while loading the decision',
    errorUpdatingDecision: 'An error occurred while updating your decision',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    copyright: 'All rights reserved © 2025 Qarari',
    tagline: 'Dr. Youssef Halil Al-Jabri',
    privacyPolicyContent: 'At qarari, we take your privacy seriously. We only collect and store the data necessary for the app to function. Your decisions are stored locally on your device and are not shared with any third parties. We do not track your usage or collect any personal information beyond what\'s strictly necessary for the app to work.\n\nWe use industry-standard security measures to protect your data, but please note that no method of electronic storage is 100% secure. By using qarari, you acknowledge that you understand and agree to these terms.\n\nIf you have any questions about our privacy practices, please contact us.',
    termsOfServiceContent: 'By using qarari, you agree to these Terms of Service. The app is provided \'as is\' without any warranties, express or implied. We reserve the right to modify or discontinue the service at any time.\n\nYou are responsible for all decisions made using the app. qarari is a tool to help you organize your thoughts and compare options, but the final decision is always yours. We are not liable for any consequences of decisions made using the app.\n\nYou agree not to use the app for any illegal purposes or in any way that could damage, disable, or impair the service. We reserve the right to terminate your access to the app if you violate these terms.',

    // History Screen
    decisionHistory: 'Your Decision History',
    noDecisionsFound: 'No Decisions Found',
    noDecisionsDesc: 'You haven\'t made any decisions yet. Start by creating a new decision!',
    tapToDelete: 'Tap on decisions to delete them',
    done: 'Done',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => { },
  isRTL: false,
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // هذا هو التغيير الوحيد: القيمة الأولية أصبحت 'ar'
  const [language, setLanguage] = useState<Language>('ar');
  const isRTL = language === 'ar';

  const t = (key: string): string => {
    // الكود هنا كان يستخدم 'en' كنوع افتراضي، من الأفضل جعله أكثر مرونة
    const langFile = translations[language];
    return langFile[key as keyof typeof langFile] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);