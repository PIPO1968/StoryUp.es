import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTranslations, getSavedLanguage, saveLanguage, formatDate, Translations } from './i18n';

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
    const [language, setLanguageState] = useState<string>(getSavedLanguage());
    const [t, setTranslations] = useState<Translations>(getTranslations(language));

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        setTranslations(getTranslations(lang));
        saveLanguage(lang);
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