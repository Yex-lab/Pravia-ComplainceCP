'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Avatar, Box, Link, Typography, Tooltip, Chip } from '@mui/material';
import type { AvatarNameCellProps } from '../types';


export function AvatarNameCell({ 
  name, 
  email, 
  avatarSrc, 
  href, 
  onClick, 
  component = 'button',
  showAvatar = true,
  isPrimary = false
}: AvatarNameCellProps) {
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
        <Avatar 
          sx={{ 
            width: 40, 
            height: 40,
            ...(isPrimary ? {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            } : {
              bgcolor: 'transparent',
              border: '2px solid',
              borderColor: 'secondary.main',
              color: 'secondary.main',
            }),
          }} 
          src={avatarSrc} 
          alt={`${name} avatar`}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
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
              label="Primary" 
              size="small" 
              color="primary"
              sx={{ height: 20, fontSize: '0.75rem' }}
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
                width: '100%'
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