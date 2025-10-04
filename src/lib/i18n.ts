// Sistema de internacionalización para StoryUp.es
// Traducciones completas para múltiples idiomas

export interface Translations {
    // Header y navegación
    appName: string;
    users: string;
    online: string;
    logout: string;

    // Dashboard
    welcome: string;
    welcomeSubtitle: string;
    createStories: string;
    createStoriesDesc: string;
    community: string;
    communityDesc: string;
    achievements: string;
    achievementsDesc: string;
    statistics: string;
    statisticsDesc: string;
    chat: string;
    chatDesc: string;
    news: string;
    newsDesc: string;

    // Navegación sidebar
    dashboard: string;
    stories: string;
    createStory: string;
    contests: string;
    profile: string;
    newsNav: string;
    statisticsNav: string;
    chatNav: string;

    // Roles
    admin: string;
    teacher: string;
    student: string;
    role: string;
    systemAdmin: string;
    parentTeacher: string;
    studentUser: string;

    // Días de la semana
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;

    // Meses
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
}

export const translations: Record<string, Translations> = {
    es: {
        // Header y navegación
        appName: 'StoryUp.es',
        users: 'Usuarios',
        online: 'Online',
        logout: 'Cerrar sesión',

        // Dashboard
        welcome: '¡Bienvenido a StoryUp.es!',
        welcomeSubtitle: 'Tu red social educativa para crear, compartir y aprender',
        createStories: 'Crea Historias',
        createStoriesDesc: 'Desarrolla tu creatividad escribiendo historias únicas y compártelas con la comunidad educativa.',
        community: 'Comunidad',
        communityDesc: 'Conecta con estudiantes, padres y docentes. Aprende y enseña en un entorno seguro y colaborativo.',
        achievements: 'Logros',
        achievementsDesc: 'Consigue trofeos y reconocimientos por tu participación y creatividad en la plataforma.',
        statistics: 'Estadísticas',
        statisticsDesc: 'Sigue tu progreso y el de tu clase con estadísticas detalladas de aprendizaje.',
        chat: 'Chat',
        chatDesc: 'Comunícate de forma segura con tu clase y profesores a través de nuestro sistema de mensajería.',
        news: 'Noticias',
        newsDesc: 'Mantente al día con las últimas noticias y actividades de tu centro educativo.',

        // Navegación sidebar
        dashboard: 'Inicio',
        stories: 'Historias',
        createStory: 'Crear Historia',
        contests: 'Concursos y Trofeos',
        profile: 'Perfil',
        newsNav: 'Noticias',
        statisticsNav: 'Estadísticas',
        chatNav: 'Chat',

        // Roles
        admin: 'Administrador',
        teacher: 'Padre/Docente',
        student: 'Estudiante',
        role: 'Rol',
        systemAdmin: 'Administrador del Sistema',
        parentTeacher: 'Padre/Docente',
        studentUser: 'Estudiante/Usuario',

        // Días de la semana
        monday: 'lunes',
        tuesday: 'martes',
        wednesday: 'miércoles',
        thursday: 'jueves',
        friday: 'viernes',
        saturday: 'sábado',
        sunday: 'domingo',

        // Meses
        january: 'enero',
        february: 'febrero',
        march: 'marzo',
        april: 'abril',
        may: 'mayo',
        june: 'junio',
        july: 'julio',
        august: 'agosto',
        september: 'septiembre',
        october: 'octubre',
        november: 'noviembre',
        december: 'diciembre'
    },

    en: {
        // Header y navegación
        appName: 'StoryUp.es',
        users: 'Users',
        online: 'Online',
        logout: 'Logout',

        // Dashboard
        welcome: 'Welcome to StoryUp.es!',
        welcomeSubtitle: 'Your educational social network to create, share and learn',
        createStories: 'Create Stories',
        createStoriesDesc: 'Develop your creativity by writing unique stories and share them with the educational community.',
        community: 'Community',
        communityDesc: 'Connect with students, parents and teachers. Learn and teach in a safe and collaborative environment.',
        achievements: 'Achievements',
        achievementsDesc: 'Earn trophies and recognition for your participation and creativity on the platform.',
        statistics: 'Statistics',
        statisticsDesc: 'Track your progress and your class progress with detailed learning statistics.',
        chat: 'Chat',
        chatDesc: 'Communicate safely with your class and teachers through our messaging system.',
        news: 'News',
        newsDesc: 'Stay up to date with the latest news and activities from your educational center.',

        // Navegación sidebar
        dashboard: 'Dashboard',
        stories: 'Stories',
        createStory: 'Create Story',
        contests: 'Contests',
        profile: 'Profile',
        newsNav: 'News',
        statisticsNav: 'Statistics',
        chatNav: 'Chat',

        // Roles
        admin: 'Administrator',
        teacher: 'Parent/Teacher',
        student: 'Student',
        role: 'Role',
        systemAdmin: 'System Administrator',
        parentTeacher: 'Parent/Teacher',
        studentUser: 'Student/User',

        // Días de la semana
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',

        // Meses
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
    },

    fr: {
        // Header y navegación
        appName: 'StoryUp.es',
        users: 'Utilisateurs',
        online: 'En ligne',
        logout: 'Déconnexion',

        // Dashboard
        welcome: 'Bienvenue sur StoryUp.es !',
        welcomeSubtitle: 'Votre réseau social éducatif pour créer, partager et apprendre',
        createStories: 'Créer des Histoires',
        createStoriesDesc: 'Développez votre créativité en écrivant des histoires uniques et partagez-les avec la communauté éducative.',
        community: 'Communauté',
        communityDesc: 'Connectez-vous avec les étudiants, parents et enseignants. Apprenez et enseignez dans un environnement sûr et collaboratif.',
        achievements: 'Réalisations',
        achievementsDesc: 'Gagnez des trophées et des reconnaissances pour votre participation et créativité sur la plateforme.',
        statistics: 'Statistiques',
        statisticsDesc: 'Suivez votre progression et celle de votre classe avec des statistiques d\'apprentissage détaillées.',
        chat: 'Chat',
        chatDesc: 'Communiquez en toute sécurité avec votre classe et vos professeurs via notre système de messagerie.',
        news: 'Actualités',
        newsDesc: 'Restez au courant des dernières nouvelles et activités de votre centre éducatif.',

        // Navegación sidebar
        dashboard: 'Tableau de bord',
        stories: 'Histoires',
        createStory: 'Créer Histoire',
        contests: 'Concours',
        profile: 'Profil',
        newsNav: 'Actualités',
        statisticsNav: 'Statistiques',
        chatNav: 'Chat',

        // Roles
        admin: 'Administrateur',
        teacher: 'Parent/Enseignant',
        student: 'Étudiant',
        role: 'Rôle',
        systemAdmin: 'Administrateur Système',
        parentTeacher: 'Parent/Enseignant',
        studentUser: 'Étudiant/Utilisateur',

        // Días de la semana
        monday: 'lundi',
        tuesday: 'mardi',
        wednesday: 'mercredi',
        thursday: 'jeudi',
        friday: 'vendredi',
        saturday: 'samedi',
        sunday: 'dimanche',

        // Meses
        january: 'janvier',
        february: 'février',
        march: 'mars',
        april: 'avril',
        may: 'mai',
        june: 'juin',
        july: 'juillet',
        august: 'août',
        september: 'septembre',
        october: 'octobre',
        november: 'novembre',
        december: 'décembre'
    },

    de: {
        // Header y navegación
        appName: 'StoryUp.es',
        users: 'Benutzer',
        online: 'Online',
        logout: 'Abmelden',

        // Dashboard
        welcome: 'Willkommen bei StoryUp.es!',
        welcomeSubtitle: 'Ihr Bildungs-Soziales Netzwerk zum Erstellen, Teilen und Lernen',
        createStories: 'Geschichten Erstellen',
        createStoriesDesc: 'Entwickeln Sie Ihre Kreativität, indem Sie einzigartige Geschichten schreiben und sie mit der Bildungsgemeinschaft teilen.',
        community: 'Gemeinschaft',
        communityDesc: 'Verbinden Sie sich mit Schülern, Eltern und Lehrern. Lernen und lehren Sie in einer sicheren und kollaborativen Umgebung.',
        achievements: 'Erfolge',
        achievementsDesc: 'Verdienen Sie Trophäen und Anerkennung für Ihre Teilnahme und Kreativität auf der Plattform.',
        statistics: 'Statistiken',
        statisticsDesc: 'Verfolgen Sie Ihren Fortschritt und den Ihrer Klasse mit detaillierten Lernstatistiken.',
        chat: 'Chat',
        chatDesc: 'Kommunizieren Sie sicher mit Ihrer Klasse und Ihren Lehrern über unser Nachrichtensystem.',
        news: 'Nachrichten',
        newsDesc: 'Bleiben Sie auf dem Laufenden mit den neuesten Nachrichten und Aktivitäten Ihres Bildungszentrums.',

        // Navegación sidebar
        dashboard: 'Dashboard',
        stories: 'Geschichten',
        createStory: 'Geschichte Erstellen',
        contests: 'Wettbewerbe',
        profile: 'Profil',
        newsNav: 'Nachrichten',
        statisticsNav: 'Statistiken',
        chatNav: 'Chat',

        // Roles
        admin: 'Administrator',
        teacher: 'Eltern/Lehrer',
        student: 'Schüler',
        role: 'Rolle',
        systemAdmin: 'Systemadministrator',
        parentTeacher: 'Eltern/Lehrer',
        studentUser: 'Schüler/Benutzer',

        // Días de la semana
        monday: 'Montag',
        tuesday: 'Dienstag',
        wednesday: 'Mittwoch',
        thursday: 'Donnerstag',
        friday: 'Freitag',
        saturday: 'Samstag',
        sunday: 'Sonntag',

        // Meses
        january: 'Januar',
        february: 'Februar',
        march: 'März',
        april: 'April',
        may: 'Mai',
        june: 'Juni',
        july: 'Juli',
        august: 'August',
        september: 'September',
        october: 'Oktober',
        november: 'November',
        december: 'Dezember'
    },

    zh: {
        // Header y navegación
        appName: 'StoryUp.es',
        users: '用户',
        online: '在线',
        logout: '退出登录',

        // Dashboard
        welcome: '欢迎来到 StoryUp.es！',
        welcomeSubtitle: '您的教育社交网络，用于创建、分享和学习',
        createStories: '创作故事',
        createStoriesDesc: '通过编写独特的故事来发展您的创造力，并与教育社区分享。',
        community: '社区',
        communityDesc: '与学生、家长和老师建立联系。在安全的协作环境中学习和教学。',
        achievements: '成就',
        achievementsDesc: '因您在平台上的参与和创造力而获得奖杯和认可。',
        statistics: '统计',
        statisticsDesc: '通过详细的学习统计跟踪您和您班级的进度。',
        chat: '聊天',
        chatDesc: '通过我们的消息系统与您的班级和老师安全沟通。',
        news: '新闻',
        newsDesc: '及时了解您的教育中心的最新新闻和活动。',

        // Navegación sidebar
        dashboard: '仪表板',
        stories: '故事',
        createStory: '创作故事',
        contests: '竞赛',
        profile: '个人资料',
        newsNav: '新闻',
        statisticsNav: '统计',
        chatNav: '聊天',

        // Roles
        admin: '管理员',
        teacher: '家长/教师',
        student: '学生',
        role: '角色',
        systemAdmin: '系统管理员',
        parentTeacher: '家长/教师',
        studentUser: '学生/用户',

        // Días de la semana
        monday: '星期一',
        tuesday: '星期二',
        wednesday: '星期三',
        thursday: '星期四',
        friday: '星期五',
        saturday: '星期六',
        sunday: '星期日',

        // Meses
        january: '一月',
        february: '二月',
        march: '三月',
        april: '四月',
        may: '五月',
        june: '六月',
        july: '七月',
        august: '八月',
        september: '九月',
        october: '十月',
        november: '十一月',
        december: '十二月'
    }
};

// Función para obtener las traducciones del idioma actual
export const getTranslations = (language: string): Translations => {
    return translations[language] || translations.es;
};

// Función para obtener el idioma guardado desde la base de datos del usuario
export const getSavedLanguage = (user: { language?: string }): string => {
    return user.language || 'es';
};

// Función para guardar el idioma seleccionado en la base de datos del usuario
export const saveLanguage = async (userId: string, language: string): Promise<void> => {
    // Implementar llamada a la API para actualizar el idioma del usuario
    await fetch(`/api/user/${userId}/language`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language })
    });
};

// Función para formatear fechas según el idioma
export const formatDate = (date: Date, language: string): string => {
    const translations = getTranslations(language);
    const days = [
        translations.sunday, translations.monday, translations.tuesday,
        translations.wednesday, translations.thursday, translations.friday, translations.saturday
    ];
    const months = [
        translations.january, translations.february, translations.march, translations.april,
        translations.may, translations.june, translations.july, translations.august,
        translations.september, translations.october, translations.november, translations.december
    ];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Formato según idioma
    switch (language) {
        case 'en':
            return `${dayName}, ${monthName} ${day}, ${year}`;
        case 'zh':
            return `${year}年${monthName}${day}日 ${dayName}`;
        case 'de':
            return `${dayName}, ${day}. ${monthName} ${year}`;
        case 'fr':
            return `${dayName} ${day} ${monthName} ${year}`;
        default: // es
            return `${dayName}, ${day} de ${monthName} de ${year}`;
    }
};