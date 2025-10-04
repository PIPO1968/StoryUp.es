import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en' | 'de' | 'fr' | 'zh' | 'ca' | 'gl' | 'eu';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    es: {
        // Header
        'header.users_registered': 'Usuarios inscritos',
        'header.users_online': 'Usuarios online',
        'header.language_selector': 'Idioma',

        // Navigation
        'nav.feed': 'Inicio',
        'nav.profile': 'Mi Perfil',
        'nav.chat': 'Chat',
        'nav.trophies': 'Trofeos',
        'nav.news': 'Noticias',
        'nav.create_story': 'Crear Historia',
        'nav.logout': 'Cerrar Sesión',

        // Feed
        'feed.title': 'Inicio',
        'feed.search_placeholder': 'Buscar en StoryUp...',
        'feed.create_story': 'Crear Historia',
        'feed.whats_happening': '¿Qué está pasando?',
        'feed.share': 'Compartir',

        // Profile
        'profile.title': 'Mi Perfil',
        'profile.edit': 'Editar Perfil',
        'profile.followers': 'Seguidores',
        'profile.following': 'Siguiendo',
        'profile.stories': 'Historias',
        'profile.trophies': 'Trofeos',
        'profile.joined': 'Se unió en',
        'profile.no_stories': 'No has publicado historias aún',
        'profile.create_first_story': 'Crear mi primera historia',
        'profile.no_trophies': '¡Aún no tienes trofeos!',
        'profile.trophy_motivation': 'Participa en actividades para ganar tus primeros trofeos',

        // Languages
        'lang.spanish': 'Español',
        'lang.english': 'Inglés',
        'lang.german': 'Alemán',
        'lang.french': 'Francés',
        'lang.chinese': 'Chino',
        'lang.catalan': 'Catalán',
        'lang.galician': 'Gallego',
        'lang.basque': 'Euskera'
    },
    en: {
        // Header
        'header.users_registered': 'Registered users',
        'header.users_online': 'Users online',
        'header.language_selector': 'Language',

        // Navigation
        'nav.feed': 'Home',
        'nav.profile': 'My Profile',
        'nav.chat': 'Chat',
        'nav.trophies': 'Trophies',
        'nav.news': 'News',
        'nav.create_story': 'Create Story',
        'nav.logout': 'Logout',

        // Feed
        'feed.title': 'Home',
        'feed.search_placeholder': 'Search StoryUp...',
        'feed.create_story': 'Create Story',
        'feed.whats_happening': 'What\'s happening?',
        'feed.share': 'Share',

        // Profile
        'profile.title': 'My Profile',
        'profile.edit': 'Edit Profile',
        'profile.followers': 'Followers',
        'profile.following': 'Following',
        'profile.stories': 'Stories',
        'profile.trophies': 'Trophies',
        'profile.joined': 'Joined',
        'profile.no_stories': 'You haven\'t published stories yet',
        'profile.create_first_story': 'Create my first story',
        'profile.no_trophies': 'You don\'t have trophies yet!',
        'profile.trophy_motivation': 'Participate in activities to earn your first trophies',

        // Languages
        'lang.spanish': 'Spanish',
        'lang.english': 'English',
        'lang.german': 'German',
        'lang.french': 'French',
        'lang.chinese': 'Chinese',
        'lang.catalan': 'Catalan',
        'lang.galician': 'Galician',
        'lang.basque': 'Basque'
    },
    de: {
        // Header
        'header.users_registered': 'Registrierte Benutzer',
        'header.users_online': 'Online-Benutzer',
        'header.language_selector': 'Sprache',

        // Navigation
        'nav.feed': 'Startseite',
        'nav.profile': 'Mein Profil',
        'nav.chat': 'Chat',
        'nav.trophies': 'Trophäen',
        'nav.news': 'Nachrichten',
        'nav.create_story': 'Geschichte erstellen',
        'nav.logout': 'Abmelden',

        // Languages
        'lang.spanish': 'Spanisch',
        'lang.english': 'Englisch',
        'lang.german': 'Deutsch',
        'lang.french': 'Französisch',
        'lang.chinese': 'Chinesisch',
        'lang.catalan': 'Katalanisch',
        'lang.galician': 'Galizisch',
        'lang.basque': 'Baskisch'
    },
    fr: {
        // Header
        'header.users_registered': 'Utilisateurs inscrits',
        'header.users_online': 'Utilisateurs en ligne',
        'header.language_selector': 'Langue',

        // Navigation
        'nav.feed': 'Accueil',
        'nav.profile': 'Mon Profil',
        'nav.chat': 'Chat',
        'nav.trophies': 'Trophées',
        'nav.news': 'Nouvelles',
        'nav.create_story': 'Créer Histoire',
        'nav.logout': 'Se déconnecter',

        // Languages
        'lang.spanish': 'Espagnol',
        'lang.english': 'Anglais',
        'lang.german': 'Allemand',
        'lang.french': 'Français',
        'lang.chinese': 'Chinois',
        'lang.catalan': 'Catalan',
        'lang.galician': 'Galicien',
        'lang.basque': 'Basque'
    },
    zh: {
        // Header
        'header.users_registered': '注册用户',
        'header.users_online': '在线用户',
        'header.language_selector': '语言',

        // Navigation
        'nav.feed': '首页',
        'nav.profile': '我的资料',
        'nav.chat': '聊天',
        'nav.trophies': '奖杯',
        'nav.news': '新闻',
        'nav.create_story': '创建故事',
        'nav.logout': '注销',

        // Languages
        'lang.spanish': '西班牙语',
        'lang.english': '英语',
        'lang.german': '德语',
        'lang.french': '法语',
        'lang.chinese': '中文',
        'lang.catalan': '加泰罗尼亚语',
        'lang.galician': '加利西亚语',
        'lang.basque': '巴斯克语'
    },
    ca: {
        // Header
        'header.users_registered': 'Usuaris registrats',
        'header.users_online': 'Usuaris en línia',
        'header.language_selector': 'Idioma',

        // Navigation
        'nav.feed': 'Inici',
        'nav.profile': 'El meu Perfil',
        'nav.chat': 'Xat',
        'nav.trophies': 'Trofeus',
        'nav.news': 'Notícies',
        'nav.create_story': 'Crear Història',
        'nav.logout': 'Tancar Sessió',

        // Languages
        'lang.spanish': 'Espanyol',
        'lang.english': 'Anglès',
        'lang.german': 'Alemany',
        'lang.french': 'Francès',
        'lang.chinese': 'Xinès',
        'lang.catalan': 'Català',
        'lang.galician': 'Gallec',
        'lang.basque': 'Eusquera'
    },
    gl: {
        // Header
        'header.users_registered': 'Usuarios rexistrados',
        'header.users_online': 'Usuarios conectados',
        'header.language_selector': 'Idioma',

        // Navigation
        'nav.feed': 'Inicio',
        'nav.profile': 'O meu Perfil',
        'nav.chat': 'Chat',
        'nav.trophies': 'Trofeos',
        'nav.news': 'Noticias',
        'nav.create_story': 'Crear Historia',
        'nav.logout': 'Cerrar Sesión',

        // Languages
        'lang.spanish': 'Español',
        'lang.english': 'Inglés',
        'lang.german': 'Alemán',
        'lang.french': 'Francés',
        'lang.chinese': 'Chinés',
        'lang.catalan': 'Catalán',
        'lang.galician': 'Galego',
        'lang.basque': 'Éuscaro'
    },
    eu: {
        // Header
        'header.users_registered': 'Erregistratutako erabiltzaileak',
        'header.users_online': 'Konektatutako erabiltzaileak',
        'header.language_selector': 'Hizkuntza',

        // Navigation
        'nav.feed': 'Hasiera',
        'nav.profile': 'Nire Profila',
        'nav.chat': 'Txata',
        'nav.trophies': 'Trofeoak',
        'nav.news': 'Albisteak',
        'nav.create_story': 'Historia Sortu',
        'nav.logout': 'Saioa Itxi',

        // Languages
        'lang.spanish': 'Gaztelania',
        'lang.english': 'Ingelesa',
        'lang.german': 'Alemana',
        'lang.french': 'Frantsesa',
        'lang.chinese': 'Txinera',
        'lang.catalan': 'Katalana',
        'lang.galician': 'Galiziera',
        'lang.basque': 'Euskera'
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('es');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('storyup-language') as Language;
        if (savedLanguage && translations[savedLanguage]) {
            setLanguage(savedLanguage);
        }
    }, []);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('storyup-language', lang);
    };

    const t = (key: string): string => {
        const currentTranslations = translations[language];
        return (currentTranslations as any)[key] || key;
    };

    const value: LanguageContextType = {
        language,
        setLanguage: changeLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}