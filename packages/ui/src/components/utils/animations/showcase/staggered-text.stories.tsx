// @ts-nocheck
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

import {
  SimpleStaggeredText,
  SimpleStaggeredWords,
  SimpleTypewriter
} from '../text/simple-staggered-text';

export default {
  title: 'Animations/Staggered Text',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Text animation components with staggered reveal effects.',
      },
    },
  },
};

export const AllTextAnimations = {
  render: () => {
    const [triggers, setTriggers] = useState({
      letters: false,
      words: false,
      typewriter: false,
      glitch: false,
      fadeIn: false,
    });

    const triggerAnimation = (key) => {
      setTriggers(prev => ({ ...prev, [key]: false }));
      setTimeout(() => {
        setTriggers(prev => ({ ...prev, [key]: true }));
      }, 100);
    };

    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h2" textAlign="center" gutterBottom>
          Staggered Text Animations
        </Typography>

        <Stack spacing={8}>
          {/* Letter by Letter */}
          <Card sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h4">Letter by Letter</Typography>
              <Button variant="contained" onClick={() => triggerAnimation('letters')}>
                Trigger Animation
              </Button>
            </Stack>
            <SimpleStaggeredText 
              text="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?" 
              variant="h1"
              delay={60}
              startAnimation={triggers.letters}
              sx={{ textAlign: 'center', letterSpacing: 2, wordBreak: 'break-all' }}
            />
          </Card>

          {/* Character Animation */}
          <Card sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h4">Character Animation</Typography>
              <Button variant="contained" onClick={() => triggerAnimation('fadeIn')}>
                Trigger Animation
              </Button>
            </Stack>
            <SimpleStaggeredText 
              text="INNOVATIVE DIGITAL EXPERIENCES THROUGH CREATIVE DESIGN AND ADVANCED TECHNOLOGY SOLUTIONS" 
              variant="h2"
              delay={40}
              startAnimation={triggers.fadeIn}
              sx={{ textAlign: 'center', fontWeight: 'bold', lineHeight: 1.2 }}
            />
          </Card>

          {/* Word by Word */}
          <Card sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h4">Word by Word</Typography>
              <Button variant="contained" onClick={() => triggerAnimation('words')}>
                Trigger Animation
              </Button>
            </Stack>
            <SimpleStaggeredWords 
              text="In the rapidly evolving landscape of modern web development, creating engaging user experiences requires a delicate balance of innovative design principles, cutting-edge technology implementations, and seamless interactive animations that captivate audiences while maintaining optimal performance across all devices and platforms in today's digital ecosystem." 
              variant="h3"
              delay={120}
              startAnimation={triggers.words}
              sx={{ textAlign: 'center', lineHeight: 1.4 }}
            />
          </Card>

          {/* Typewriter */}
          <Card sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h4">Typewriter</Typography>
              <Button variant="contained" onClick={() => triggerAnimation('typewriter')}>
                Trigger Animation
              </Button>
            </Stack>
            <SimpleTypewriter 
              text="Welcome to the future of digital storytelling and interactive web experiences. In this comprehensive demonstration, we explore the fascinating world of typewriter animations that bring content to life through dynamic, character-by-character reveals.

The art of typography in motion has evolved significantly over the past decade, transforming from simple text displays into sophisticated narrative tools that engage users on multiple sensory levels. Each character that appears on screen serves a purpose, building anticipation, conveying emotion, and guiding the reader through carefully crafted journeys of discovery.

Modern web applications leverage these animation techniques to create memorable brand experiences, enhance user engagement, and communicate complex ideas through the power of progressive disclosure. Whether you're building a portfolio website, a marketing landing page, or an interactive storytelling platform, typewriter effects add that essential human touch that connects with audiences.

The technical implementation involves precise timing controls, smooth character transitions, and responsive design considerations that ensure optimal performance across all devices and screen sizes. This creates a seamless experience that feels natural and intuitive to users while maintaining the technical excellence that modern web standards demand." 
              variant="h4"
              delay={30}
              startAnimation={triggers.typewriter}
              sx={{ textAlign: 'left', lineHeight: 1.8 }}
            />
          </Card>

          {/* Static Text (No Animation) */}
          <Card sx={{ p: 4, bgcolor: 'grey.100' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h4">Static Text (No Animation)</Typography>
            </Stack>
            <Typography variant="h1" sx={{ textAlign: 'center', color: 'text.secondary', fontFamily: 'monospace', fontWeight: 'bold' }}>
              STATIC DISPLAY TEXT
            </Typography>
          </Card>
        </Stack>
      </Container>
    );
  },
};

export const LettersOnly = {
  render: () => {
    const [trigger, setTrigger] = useState(false);

    const triggerAnimation = () => {
      setTrigger(false);
      setTimeout(() => setTrigger(true), 100);
    };

    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Button variant="contained" size="large" onClick={triggerAnimation} sx={{ mb: 4 }}>
          Animate Letters
        </Button>
        <SimpleStaggeredText 
          text="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?" 
          variant="h1"
          delay={50}
          startAnimation={trigger}
          sx={{ letterSpacing: 1, wordBreak: 'break-all', lineHeight: 1.2 }}
        />
      </Container>
    );
  },
};

export const WordsOnly = {
  render: () => {
    const [trigger, setTrigger] = useState(false);

    const triggerAnimation = () => {
      setTrigger(false);
      setTimeout(() => setTrigger(true), 100);
    };

    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Button variant="contained" size="large" onClick={triggerAnimation} sx={{ mb: 4 }}>
          Animate Words
        </Button>
        <SimpleStaggeredWords 
          text="Innovation drives progress while creativity fuels imagination and technology transforms possibilities into reality through collaborative efforts and visionary thinking that pushes boundaries beyond conventional limitations to create extraordinary digital experiences that inspire and captivate audiences worldwide with meaningful interactions and purposeful design solutions" 
          variant="h2"
          delay={150}
          startAnimation={trigger}
          sx={{ lineHeight: 1.3 }}
        />
      </Container>
    );
  },
};

export const ConfigurationControls = {
  render: () => {
    const [letterConfig, setLetterConfig] = useState({
      trigger: false,
      delay: 50,
      duration: 0.5,
      yOffset: 20,
    });

    const [wordConfig, setWordConfig] = useState({
      trigger: false,
      delay: 100,
      duration: 0.6,
      yOffset: 20,
    });

    const [typewriterConfig, setTypewriterConfig] = useState({
      trigger: false,
      delay: 50,
      showCursor: true,
      cursorChar: '|',
    });

    const triggerLetters = () => {
      setLetterConfig(prev => ({ ...prev, trigger: false }));
      setTimeout(() => setLetterConfig(prev => ({ ...prev, trigger: true })), 100);
    };

    const triggerWords = () => {
      setWordConfig(prev => ({ ...prev, trigger: false }));
      setTimeout(() => setWordConfig(prev => ({ ...prev, trigger: true })), 100);
    };

    const triggerTypewriter = () => {
      setTypewriterConfig(prev => ({ ...prev, trigger: false }));
      setTimeout(() => setTypewriterConfig(prev => ({ ...prev, trigger: true })), 100);
    };

    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h2" textAlign="center" gutterBottom>
          Animation Configuration Controls
        </Typography>

        <Stack spacing={6}>
          {/* Letter Animation Controls */}
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Letter Animation</Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={triggerLetters}>
                Trigger
              </Button>
              <Box>
                <Typography variant="caption">Delay (ms): {letterConfig.delay}</Typography>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  value={letterConfig.delay}
                  onChange={(e) => setLetterConfig(prev => ({ ...prev, delay: Number(e.target.value) }))}
                />
              </Box>
              <Box>
                <Typography variant="caption">Duration (s): {letterConfig.duration}</Typography>
                <input 
                  type="range" 
                  min="0.1" 
                  max="2" 
                  step="0.1"
                  value={letterConfig.duration}
                  onChange={(e) => setLetterConfig(prev => ({ ...prev, duration: Number(e.target.value) }))}
                />
              </Box>
              <Box>
                <Typography variant="caption">Y Offset: {letterConfig.yOffset}</Typography>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={letterConfig.yOffset}
                  onChange={(e) => setLetterConfig(prev => ({ ...prev, yOffset: Number(e.target.value) }))}
                />
              </Box>
            </Stack>

            <SimpleStaggeredText 
              text="HELLO WORLD ANIMATION" 
              variant="h2"
              delay={letterConfig.delay}
              duration={letterConfig.duration}
              yOffset={letterConfig.yOffset}
              startAnimation={letterConfig.trigger}
              sx={{ textAlign: 'center', fontWeight: 'bold' }}
            />
          </Card>

          {/* Word Animation Controls */}
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Word Animation</Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={triggerWords}>
                Trigger
              </Button>
              <Box>
                <Typography variant="caption">Delay (ms): {wordConfig.delay}</Typography>
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  value={wordConfig.delay}
                  onChange={(e) => setWordConfig(prev => ({ ...prev, delay: Number(e.target.value) }))}
                />
              </Box>
              <Box>
                <Typography variant="caption">Duration (s): {wordConfig.duration}</Typography>
                <input 
                  type="range" 
                  min="0.2" 
                  max="2" 
                  step="0.1"
                  value={wordConfig.duration}
                  onChange={(e) => setWordConfig(prev => ({ ...prev, duration: Number(e.target.value) }))}
                />
              </Box>
              <Box>
                <Typography variant="caption">Y Offset: {wordConfig.yOffset}</Typography>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={wordConfig.yOffset}
                  onChange={(e) => setWordConfig(prev => ({ ...prev, yOffset: Number(e.target.value) }))}
                />
              </Box>
            </Stack>

            <SimpleStaggeredWords 
              text="This sentence demonstrates word by word animation with configurable timing and effects" 
              variant="h3"
              delay={wordConfig.delay}
              duration={wordConfig.duration}
              yOffset={wordConfig.yOffset}
              startAnimation={wordConfig.trigger}
              sx={{ textAlign: 'center' }}
            />
          </Card>

          {/* Typewriter Controls */}
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Typewriter</Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={triggerTypewriter}>
                Trigger
              </Button>
              <Box>
                <Typography variant="caption">Speed (ms): {typewriterConfig.delay}</Typography>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  value={typewriterConfig.delay}
                  onChange={(e) => setTypewriterConfig(prev => ({ ...prev, delay: Number(e.target.value) }))}
                />
              </Box>
              <Box>
                <Typography variant="caption">Show Cursor</Typography>
                <input 
                  type="checkbox" 
                  checked={typewriterConfig.showCursor}
                  onChange={(e) => setTypewriterConfig(prev => ({ ...prev, showCursor: e.target.checked }))}
                />
              </Box>
              <Box>
                <Typography variant="caption">Cursor:</Typography>
                <input 
                  type="text" 
                  value={typewriterConfig.cursorChar}
                  onChange={(e) => setTypewriterConfig(prev => ({ ...prev, cursorChar: e.target.value }))}
                  style={{ width: '40px' }}
                />
              </Box>
            </Stack>

            <SimpleTypewriter 
              text="This typewriter effect demonstrates configurable typing speed, cursor visibility, and custom cursor characters for different visual styles." 
              variant="h4"
              delay={typewriterConfig.delay}
              showCursor={typewriterConfig.showCursor}
              cursorChar={typewriterConfig.cursorChar}
              startAnimation={typewriterConfig.trigger}
            />
          </Card>
        </Stack>
      </Container>
    );
  },
};
