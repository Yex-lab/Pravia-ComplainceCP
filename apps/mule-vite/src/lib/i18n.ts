import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const fallbackLng = 'en';
const allLangs = ['en', 'es'];

const detection = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage'],
  lookupLocalStorage: 'i18nextLng',
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../locales/langs/${language}/${namespace}.json`)
    )
  )
  .init({
    lng: undefined,
    fallbackLng,
    debug: false,
    ns: ['common', 'messages'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection,
    supportedLngs: allLangs,
  });

export default i18n;
