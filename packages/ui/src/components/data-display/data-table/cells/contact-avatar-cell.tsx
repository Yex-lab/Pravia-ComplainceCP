import { ICONS, Iconify } from '@asyml8/ui';
import { useRef, useState, useEffect } from 'react';

import { Box, Link, Chip, Tooltip, Typography } from '@mui/material';

interface ContactAvatarCellProps {
  name: string;
  email?: string;
  avatarSrc?: string;
  href?: string;
  onClick?: () => void;
  component?: React.ElementType;
  showAvatar?: boolean;
  isPrimary?: boolean;
  primaryLabel?: string;
  isLoggedInUser?: boolean;
}

export function ContactAvatarCell({
  name,
  email,
  avatarSrc,
  href,
  onClick,
  component = 'button',
  showAvatar = true,
  isPrimary = false,
  primaryLabel = 'Primary',
  isLoggedInUser = false,
}: ContactAvatarCellProps) {
  const emailRef = useRef<HTMLSpanElement>(null);
  const [isEmailTruncated, setIsEmailTruncated] = useState(false);

  useEffect(() => {
    if (emailRef.current) {
      setIsEmailTruncated(emailRef.current.scrollWidth > emailRef.current.clientWidth);
    }
  }, [email]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {showAvatar && (
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...(isPrimary
              ? {
                  color: 'success.main',
                }
              : isLoggedInUser
              ? {
                  color: 'secondary.main',
                }
              : {
                  color: 'primary.main',
                }),
          }}
        >
          <Iconify icon={ICONS.USER_ID_DUOTONE as any} width={40} />
        </Box>
      )}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {href || onClick ? (
            <Link
              component={component}
              variant="subtitle2"
              href={href}
              onClick={onClick}
              aria-label={email ? `${name} - ${email}` : name}
              sx={{
                textAlign: 'left',
                textDecoration: 'none',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'text.primary',
              }}
            >
              {name}
            </Link>
          ) : (
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </Typography>
          )}
          {isPrimary && (
            <Chip
              label={primaryLabel}
              size="small"
              color="success"
              sx={{
                height: 20,
                fontWeight: 800,
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                '& .MuiChip-label': {
                  fontWeight: 800,
                  px: 1.5,
                },
              }}
            />
          )}
        </Box>
        {email && (
          <Tooltip title={isEmailTruncated ? email : ''} arrow>
            <Typography
              ref={emailRef}
              variant="body2"
              sx={{
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {email}
            </Typography>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
