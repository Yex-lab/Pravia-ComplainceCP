// ----------------------------------------------------------------------

export const fallbackLng = 'en';

export const languages = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'US',
    adapterLocale: 'en',
    numberFormat: {
      code: 'en-US',
      currency: 'USD',
    },
  },
  {
    value: 'es',
    label: 'Español',
    countryCode: 'ES',
    adapterLocale: 'es',
    numberFormat: {
      code: 'es-ES',
      currency: 'EUR',
    },
  },
] as const;

export type LangCode = (typeof languages)[number]['value'];

export const getCurrentLang = (langCode?: string) => {
  const currentLang = languages.find((lang) => lang.value === langCode);

  return currentLang ?? languages[0];
};

export const allLangs = languages.map((lang) => lang.value);
