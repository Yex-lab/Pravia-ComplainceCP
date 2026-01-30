'use client';

import type { Namespace } from 'i18next';
import type { LangCode } from './locales-config';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { withNotifications } from '@asyml8/ui';

import { fallbackLng, getCurrentLang } from './locales-config';

// ----------------------------------------------------------------------

export function useTranslate(namespace?: Namespace) {
  const { t, i18n } = useTranslation(namespace);
  const { t: tMessages } = useTranslation('messages');

  const currentLang = getCurrentLang(i18n.resolvedLanguage);

  const handleChangeLang = useCallback(
    async (lang: LangCode) =>
      withNotifications(() => i18n.changeLanguage(lang), {
        loading: 'Switching language...',
        success: tMessages('languageSwitch.success'),
        error: tMessages('languageSwitch.error'),
      }),
    [i18n, tMessages]
  );

  const handleResetLang = useCallback(() => {
    handleChangeLang(fallbackLng);
  }, [handleChangeLang]);

  return {
    t,
    i18n,
    currentLang,
    onChangeLang: handleChangeLang,
    onResetLang: handleResetLang,
  };
}
