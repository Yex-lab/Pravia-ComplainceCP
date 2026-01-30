import type { LanguagePopoverProps as UILanguagePopoverProps } from '@asyml8/ui';
import type { LangCode } from 'src/locales';

import { LanguagePopover as UILanguagePopover } from '@asyml8/ui';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export type LanguagePopoverProps = Omit<UILanguagePopoverProps, 'currentLang' | 'onChangeLang'>;

export function LanguagePopover(props: LanguagePopoverProps) {
  const { onChangeLang, currentLang } = useTranslate();

  return (
    <UILanguagePopover
      {...props}
      currentLang={currentLang}
      onChangeLang={(langValue) => onChangeLang(langValue as LangCode)}
    />
  );
}
