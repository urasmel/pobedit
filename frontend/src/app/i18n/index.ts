import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import ruTranslation from '@/shared/locales/ru/translation.json';
import enTranslation from '@/shared/locales/en/translation.json';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            ru: {
                translation: ruTranslation
            },
        },
        fallbackLng: 'ru',
        debug: process.env.NODE_ENV === 'development',
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
    });

export default i18n;
