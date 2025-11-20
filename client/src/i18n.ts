// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files (or define them here)
import en from './translation/en/translation.json';
import es from './translation/es/translation.json'

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false, 
  },
 });

export default i18n;