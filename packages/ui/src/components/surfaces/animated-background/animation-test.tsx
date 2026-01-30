'use client';

import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export function AnimationTest() {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box sx={{ textAlign: 'center' }}>
        {/* Simple fade in animation */}
        <m.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2" sx={{ mb: 4 }}>
            Animation Test
          </Typography>
        </m.div>

        {/* Bouncing box */}
        <Box
          component={m.div}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          sx={{
            width: 100,
            height: 100,
            bgcolor: 'primary.main',
            borderRadius: 2,
            mx: 'auto',
            mb: 4,
          }}
        />

        {/* Staggered text animation */}
        <Box>
          {"Hello World".split('').map((letter, index) => (
            <Box
              key={index}
              component={m.span}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
              }}
              sx={{ display: 'inline-block', fontSize: '2rem' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
