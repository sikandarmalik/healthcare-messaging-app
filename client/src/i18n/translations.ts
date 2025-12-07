export type Language = 'en' | 'zh-HK';

export const translations = {
  en: {
    // App name
    appName: 'HealthConnect HK',
    appTagline: 'Secure Healthcare Messaging',
    
    // Navigation
    conversations: 'Conversations',
    appointments: 'Appointments',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signInTitle: 'Sign in to your account',
    signUpTitle: 'Create your patient account',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    hkid: 'HKID Number',
    hkidPlaceholder: 'A123456(7)',
    dateOfBirth: 'Date of Birth',
    phone: 'Phone Number',
    phonePlaceholder: '+852 9XXX XXXX',
    address: 'Address',
    addressPlaceholder: 'District, Hong Kong',
    signingIn: 'Signing in...',
    creatingAccount: 'Creating account...',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    registerHere: 'Register here',
    signInHere: 'Sign in here',
    invalidCredentials: 'Invalid email or password',
    registrationFailed: 'Registration failed. Please try again.',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    
    // Demo
    demoCredentials: 'Demo Credentials',
    doctor: 'Doctor',
    patient: 'Patient',
    
    // Conversations
    newConversation: 'New Conversation',
    startConversation: 'Start a conversation',
    selectDoctor: 'Select a doctor to message:',
    cancel: 'Cancel',
    noConversations: 'No conversations yet',
    startWithDoctor: 'Start a conversation with a doctor',
    yesterday: 'Yesterday',
    today: 'Today',
    
    // Messages
    typeMessage: 'Type a message...',
    sendFile: 'Send a file',
    fileSizeLimit: 'File size must be less than 5MB',
    fileTypeLimit: 'Only PDF, JPG, and PNG files are allowed',
    attachment: 'Attachment',
    
    // Roles
    roleDoctor: 'Doctor',
    rolePatient: 'Patient',
    roleAdmin: 'Admin',
    
    // Time
    am: 'AM',
    pm: 'PM',
    
    // Specialties
    generalMedicine: 'General Medicine',
    cardiology: 'Cardiology',
    dermatology: 'Dermatology',
    neurology: 'Neurology',
    orthopedics: 'Orthopedics',
    pediatrics: 'Pediatrics',
    psychiatry: 'Psychiatry',
    
    // Features
    secureMessaging: 'Secure Messaging',
    secureMessagingDesc: 'End-to-end encrypted communication with your healthcare providers',
    quickAppointments: 'Quick Appointments',
    quickAppointmentsDesc: 'Schedule appointments directly with your doctors',
    medicalRecords: 'Medical Records',
    medicalRecordsDesc: 'Access and share your medical documents securely',
    
    // Hong Kong specific
    hospitalAuthority: 'Compliant with Hong Kong Hospital Authority standards',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contactSupport: 'Contact Support',
    emergencyHotline: 'Emergency Hotline: 999',
    haHotline: 'HA Hotline: 2882 4866',
    
    // Language
    language: 'Language',
    english: 'English',
    traditionalChinese: '繁體中文',
    
    // Landing page
    haCompliant: 'HA Compliant',
    heroTitle1: "Hong Kong's Premier",
    heroTitle2: 'Healthcare Messaging',
    heroDescription: "Connect with your healthcare providers securely, privately, and conveniently. Designed specifically for Hong Kong's healthcare system.",
    getStarted: 'Get Started',
    startFree: 'Start Free',
    whyChoose: 'Why Choose HealthConnect?',
    whyChooseDesc: 'We provide comprehensive healthcare communication solutions to keep you connected with your medical team.',
    featureEncryption: 'End-to-End Encryption',
    featureEncryptionDesc: 'Your health conversations are protected with enterprise-grade security.',
    featureScheduling: 'Easy Scheduling',
    featureSchedulingDesc: 'Book appointments with your doctors directly through the platform.',
    featureDocuments: 'Document Sharing',
    featureDocumentsDesc: 'Securely share medical reports, prescriptions, and referral letters.',
    feature247: '24/7 Access',
    feature247Desc: 'Connect with your healthcare providers anytime, anywhere.',
    featureRecords: 'Medical Records',
    featureRecordsDesc: 'Access your complete medical history in one secure location.',
    featureLocal: 'Hong Kong Based',
    featureLocalDesc: 'Designed specifically for Hong Kong healthcare standards.',
    ctaTitle: 'Start Your Health Journey Today',
    ctaDescription: 'Join over 10,000 Hong Kong residents experiencing better healthcare communication.',
    createAccount: 'Create Free Account',
    quickLinks: 'Quick Links',
    emergency: 'Emergency',
    footerDescription: "HealthConnect HK is Hong Kong's leading healthcare messaging platform, dedicated to providing secure and convenient communication between patients and healthcare providers.",
    allRightsReserved: 'All rights reserved.',
    partnerClinics: 'Partner Clinics',
    activePatients: 'Active Patients',
    uptime: 'Uptime',
    support: 'Support',
  },
  'zh-HK': {
    // App name
    appName: '康訊通 HK',
    appTagline: '安全醫療通訊平台',
    
    // Navigation
    conversations: '對話',
    appointments: '預約',
    profile: '個人資料',
    settings: '設定',
    logout: '登出',
    
    // Auth
    signIn: '登入',
    signUp: '註冊',
    signInTitle: '登入您的帳戶',
    signUpTitle: '建立病人帳戶',
    email: '電郵地址',
    password: '密碼',
    confirmPassword: '確認密碼',
    fullName: '姓名',
    hkid: '香港身份證號碼',
    hkidPlaceholder: 'A123456(7)',
    dateOfBirth: '出生日期',
    phone: '電話號碼',
    phonePlaceholder: '+852 9XXX XXXX',
    address: '地址',
    addressPlaceholder: '地區，香港',
    signingIn: '登入中...',
    creatingAccount: '建立帳戶中...',
    noAccount: '還沒有帳戶？',
    hasAccount: '已有帳戶？',
    registerHere: '按此註冊',
    signInHere: '按此登入',
    invalidCredentials: '電郵或密碼錯誤',
    registrationFailed: '註冊失敗，請重試。',
    passwordMismatch: '密碼不相符',
    passwordTooShort: '密碼需至少6個字元',
    
    // Demo
    demoCredentials: '示範帳戶',
    doctor: '醫生',
    patient: '病人',
    
    // Conversations
    newConversation: '新對話',
    startConversation: '開始對話',
    selectDoctor: '選擇醫生：',
    cancel: '取消',
    noConversations: '暫無對話',
    startWithDoctor: '開始與醫生對話',
    yesterday: '昨天',
    today: '今天',
    
    // Messages
    typeMessage: '輸入訊息...',
    sendFile: '發送檔案',
    fileSizeLimit: '檔案大小不能超過5MB',
    fileTypeLimit: '只接受 PDF、JPG 及 PNG 檔案',
    attachment: '附件',
    
    // Roles
    roleDoctor: '醫生',
    rolePatient: '病人',
    roleAdmin: '管理員',
    
    // Time
    am: '上午',
    pm: '下午',
    
    // Specialties
    generalMedicine: '普通科',
    cardiology: '心臟科',
    dermatology: '皮膚科',
    neurology: '腦神經科',
    orthopedics: '骨科',
    pediatrics: '兒科',
    psychiatry: '精神科',
    
    // Features
    secureMessaging: '安全通訊',
    secureMessagingDesc: '與您的醫療服務提供者進行端對端加密通訊',
    quickAppointments: '快速預約',
    quickAppointmentsDesc: '直接與您的醫生預約診症',
    medicalRecords: '醫療紀錄',
    medicalRecordsDesc: '安全地存取和分享您的醫療文件',
    
    // Hong Kong specific
    hospitalAuthority: '符合香港醫院管理局標準',
    privacyPolicy: '私隱政策',
    termsOfService: '服務條款',
    contactSupport: '聯絡支援',
    emergencyHotline: '緊急求助熱線：999',
    haHotline: '醫管局熱線：2882 4866',
    
    // Language
    language: '語言',
    english: 'English',
    traditionalChinese: '繁體中文',
    
    // Landing page
    haCompliant: '符合香港醫管局標準',
    heroTitle1: '香港首選',
    heroTitle2: '醫療通訊平台',
    heroDescription: '安全、私密、便捷地與您的醫療服務提供者溝通。專為香港醫療系統而設計。',
    getStarted: '立即開始',
    startFree: '免費註冊',
    whyChoose: '為何選擇康訊通？',
    whyChooseDesc: '我們提供全面的醫療通訊解決方案，讓您與醫療團隊保持緊密聯繫。',
    featureEncryption: '端對端加密',
    featureEncryptionDesc: '您的健康對話受到企業級安全保護。',
    featureScheduling: '輕鬆預約',
    featureSchedulingDesc: '直接透過平台預約您的醫生。',
    featureDocuments: '文件分享',
    featureDocumentsDesc: '安全分享醫療報告、處方和轉介信。',
    feature247: '全天候服務',
    feature247Desc: '隨時隨地與您的醫療服務提供者聯繫。',
    featureRecords: '醫療紀錄',
    featureRecordsDesc: '在一個安全位置存取您的完整醫療紀錄。',
    featureLocal: '香港本地',
    featureLocalDesc: '專為香港醫療標準而設計。',
    ctaTitle: '立即開始您的健康之旅',
    ctaDescription: '加入超過10,000名香港市民，體驗更便捷的醫療通訊服務。',
    createAccount: '免費註冊帳戶',
    quickLinks: '快速連結',
    emergency: '緊急聯絡',
    footerDescription: '康訊通是香港領先的醫療通訊平台，致力於為病人和醫療服務提供者提供安全、便捷的溝通渠道。',
    allRightsReserved: '版權所有。',
    partnerClinics: '合作診所',
    activePatients: '活躍病人',
    uptime: '正常運行時間',
    support: '支援服務',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
