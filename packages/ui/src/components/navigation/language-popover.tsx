import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';
import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';
import { varTap, FlagIcon, varHover, CustomPopover, transitionTap } from '@asyml8/ui';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

export type LanguageOption = {
  value: string;
  label: string;
  countryCode: string;
};

export type LanguagePopoverProps = IconButtonProps & {
  data?: LanguageOption[];
  currentLang: LanguageOption;
  onChangeLang: (langValue: string) => void;
};

export function LanguagePopover({
  data = [],
  currentLang,
  onChangeLang,
  sx,
  ...other
}: LanguagePopoverProps) {
  const { open, anchorEl, onClose, onOpen } = usePopover();

  const handleChangeLang = useCallback(
    (langValue: string) => {
      onChangeLang(langValue);
      onClose();
    },
    [onChangeLang, onClose]
  );

  const renderMenuList = () => (
    <CustomPopover open={open} anchorEl={anchorEl} onClose={onClose}>
      <MenuList sx={{ width: 160, minHeight: 72 }}>
        {data?.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang.value}
            onClick={() => handleChangeLang(option.value)}
          >
            <FlagIcon code={option.countryCode} />
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Languages button"
        onClick={onOpen}
        sx={[
          (theme) => ({
            p: 0,
            width: 40,
            height: 40,
            ...(open && { bgcolor: theme.vars.palette.action.selected }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <FlagIcon code={currentLang.countryCode} />
      </IconButton>

      {renderMenuList()}
    </>
  );
}
