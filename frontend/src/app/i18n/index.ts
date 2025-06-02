import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from '@/shared/locales/ru/translation.json';

i18n
    .use(initReactI18next)
    .init({
        lng: 'ru', // default language
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        resources: {
            en: {
                translation: translation
            }
        }
    });

export default i18n;
