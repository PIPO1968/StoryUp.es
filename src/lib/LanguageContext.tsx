import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTranslations, formatDate, Translations, saveLanguage } from './i18n';
import { useAuth } from '../App';

interface LanguageContextType {
    language: string;
    t: Translations;
    setLanguage: (lang: string) => void;
    formatDate: (date: Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [language, setLanguageState] = useState<string>(user?.language || 'es');
    const [t, setTranslations] = useState<Translations>(getTranslations(language));

    const setLanguage = async (lang: string) => {
        setLanguageState(lang);
        setTranslations(getTranslations(lang));
        if (user?.id) {
            await saveLanguage(user.id, lang);
        }
    };

    const formatDateWithLanguage = (date: Date): string => {
        return formatDate(date, language);
    };

    useEffect(() => {
        setTranslations(getTranslations(language));
    }, [language]);

    const value: LanguageContextType = {
        language,
        t,
        setLanguage,
        formatDate: formatDateWithLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};