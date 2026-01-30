'use client';

import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface SimpleStaggeredTextProps {
  text: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  delay?: number;
  duration?: number;
  yOffset?: number;
  startAnimation?: boolean;
  sx?: any;
}

export function SimpleStaggeredText({
  text,
  variant = 'h1',
  delay = 50,
  duration = 0.5,
  yOffset = 20,
  startAnimation = true,
  sx = {},
}: SimpleStaggeredTextProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (startAnimation) {
      setAnimationKey(prev => prev + 1);
    }
  }, [startAnimation]);

  const letters = text.split('');

  return (
    <Typography variant={variant} sx={{ display: 'inline-block', ...sx }}>
      {letters.map((letter, index) => (
        <Box
          key={`${animationKey}-${index}`}
          component={m.span}
          initial={{ opacity: 0, y: yOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * (delay / 1000),
            duration,
            ease: 'easeOut',
          }}
          sx={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </Box>
      ))}
    </Typography>
  );
}

export function SimpleStaggeredWords({
  text,
  variant = 'h1',
  delay = 100,
  duration = 0.6,
  yOffset = 20,
  startAnimation = true,
  sx = {},
}: SimpleStaggeredTextProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (startAnimation) {
      setAnimationKey(prev => prev + 1);
    }
  }, [startAnimation]);

  const words = text.split(' ');

  return (
    <Typography variant={variant} sx={sx}>
      {words.map((word, index) => (
        <Box
          key={`${animationKey}-${index}`}
          component={m.span}
          initial={{ opacity: 0, y: yOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * (delay / 1000),
            duration,
            ease: 'easeOut',
          }}
          sx={{ display: 'inline-block', mr: 1 }}
        >
          {word}
        </Box>
      ))}
    </Typography>
  );
}

export function SimpleTypewriter({
  text,
  variant = 'h1',
  delay = 50,
  showCursor = true,
  cursorChar = '|',
  startAnimation = true,
  sx = {},
}: SimpleStaggeredTextProps & {
  showCursor?: boolean;
  cursorChar?: string;
}) {
  const [displayText, setDisplayText] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (startAnimation) {
      setDisplayText('');
      setAnimationKey(prev => prev + 1);
      
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, delay);

      return () => clearInterval(timer);
    }
  }, [startAnimation, text, delay]);

  return (
    <Box>
      <Typography variant={variant} sx={{ fontFamily: 'monospace', whiteSpace: 'pre-line', ...sx }}>
        {displayText}
        {showCursor && (
          <Box 
            component="span" 
            sx={{ 
              '@keyframes blink': {
                '0%, 50%': { opacity: 1 },
                '51%, 100%': { opacity: 0 },
              },
              animation: 'blink 1s infinite' 
            }}
          >
            {cursorChar}
          </Box>
        )}
      </Typography>
    </Box>
  );
}
