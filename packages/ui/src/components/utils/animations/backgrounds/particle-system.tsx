'use client';

import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  trail: { x: number; y: number; opacity: number }[];
}

interface ParticleSystemProps extends Omit<BoxProps, 'children'> {
  /** Number of particles to render */
  particleCount?: number;
  /** Particle size range */
  particleSize?: [number, number];
  /** Particle speed multiplier */
  speed?: number;
  /** Mouse interaction radius */
  interactionRadius?: number;
  /** Enable mouse trail effect */
  enableTrail?: boolean;
  /** Trail length for particles */
  trailLength?: number;
  /** Particle colors (will use theme colors if not provided) */
  colors?: string[];
  /** Animation preset */
  preset?: 'default' | 'cosmic' | 'neural' | 'energy' | 'minimal';
  /** Enable connection lines between nearby particles */
  enableConnections?: boolean;
  /** Connection distance threshold */
  connectionDistance?: number;
  /** Performance mode (reduces particles on mobile) */
  performanceMode?: boolean;
}

// ----------------------------------------------------------------------
// Presets for different particle effects

const particlePresets = {
  default: {
    particleCount: 50,
    particleSize: [1, 3] as [number, number],
    speed: 0.5,
    interactionRadius: 100,
    enableTrail: true,
    trailLength: 5,
    enableConnections: false,
    connectionDistance: 80,
  },
  cosmic: {
    particleCount: 80,
    particleSize: [0.5, 2] as [number, number],
    speed: 0.3,
    interactionRadius: 150,
    enableTrail: true,
    trailLength: 8,
    enableConnections: true,
    connectionDistance: 120,
  },
  neural: {
    particleCount: 60,
    particleSize: [1, 2] as [number, number],
    speed: 0.4,
    interactionRadius: 80,
    enableTrail: false,
    trailLength: 0,
    enableConnections: true,
    connectionDistance: 100,
  },
  energy: {
    particleCount: 100,
    particleSize: [0.5, 4] as [number, number],
    speed: 0.8,
    interactionRadius: 120,
    enableTrail: true,
    trailLength: 10,
    enableConnections: false,
    connectionDistance: 60,
  },
  minimal: {
    particleCount: 30,
    particleSize: [1, 2] as [number, number],
    speed: 0.2,
    interactionRadius: 60,
    enableTrail: false,
    trailLength: 0,
    enableConnections: false,
    connectionDistance: 0,
  },
};

// ----------------------------------------------------------------------

export function ParticleSystem({
  particleCount,
  particleSize,
  speed,
  interactionRadius,
  enableTrail,
  trailLength,
  colors,
  preset = 'default',
  enableConnections,
  connectionDistance,
  performanceMode = true,
  sx,
  ...other
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const [isClient, setIsClient] = useState(false);
  
  const [mode] = useState<'light' | 'dark'>('light');

  // Get preset configuration
  const config = {
    ...particlePresets[preset],
    ...(particleCount !== undefined && { particleCount }),
    ...(particleSize !== undefined && { particleSize }),
    ...(speed !== undefined && { speed }),
    ...(interactionRadius !== undefined && { interactionRadius }),
    ...(enableTrail !== undefined && { enableTrail }),
    ...(trailLength !== undefined && { trailLength }),
    ...(enableConnections !== undefined && { enableConnections }),
    ...(connectionDistance !== undefined && { connectionDistance }),
  };

  // Adjust particle count for performance on mobile
  const finalParticleCount = performanceMode && typeof window !== 'undefined' && window.innerWidth < 768
    ? Math.floor(config.particleCount * 0.6)
    : config.particleCount;

  // Get theme-appropriate colors
  const getParticleColors = useCallback(() => {
    if (colors) return colors;
    
    return mode === 'dark'
      ? ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
      : ['#1e40af', '#7c3aed', '#0891b2', '#059669', '#d97706'];
  }, [colors, mode]);

  // Initialize particles
  const initializeParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const particleColors = getParticleColors();
    
    for (let i = 0; i < finalParticleCount; i++) {
      const size = config.particleSize[0] + Math.random() * (config.particleSize[1] - config.particleSize[0]);
      const maxLife = 200 + Math.random() * 300;
      
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size,
        opacity: 0.3 + Math.random() * 0.7,
        life: maxLife,
        maxLife,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        trail: [],
      });
    }
    
    particlesRef.current = particles;
  }, [finalParticleCount, config, getParticleColors]);

  // Update particle physics
  const updateParticles = useCallback((canvas: HTMLCanvasElement) => {
    const mouse = mouseRef.current;
    
    particlesRef.current.forEach((particle) => {
      // Mouse interaction
      if (mouse.isMoving) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.interactionRadius) {
          const force = (config.interactionRadius - distance) / config.interactionRadius;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.02;
          particle.vy += Math.sin(angle) * force * 0.02;
        }
      }
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Add friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Boundary collision with bounce
      if (particle.x <= 0 || particle.x >= canvas.width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= canvas.height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      }
      
      // Update trail
      if (config.enableTrail) {
        particle.trail.unshift({ x: particle.x, y: particle.y, opacity: particle.opacity });
        if (particle.trail.length > config.trailLength) {
          particle.trail.pop();
        }
      }
      
      // Update life and opacity
      particle.life -= 1;
      if (particle.life <= 0) {
        // Respawn particle
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.vx = (Math.random() - 0.5) * config.speed;
        particle.vy = (Math.random() - 0.5) * config.speed;
        particle.life = particle.maxLife;
      }
      
      // Pulsing opacity effect
      particle.opacity = 0.3 + 0.4 * (1 + Math.sin(Date.now() * 0.001 + particle.id)) / 2;
    });
  }, [config]);

  // Draw particles and connections
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections first (behind particles)
    if (config.enableConnections) {
      ctx.strokeStyle = mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < config.connectionDistance) {
            const opacity = (1 - distance / config.connectionDistance) * 0.3;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Draw particles
    particlesRef.current.forEach((particle) => {
      // Draw trail
      if (config.enableTrail && particle.trail.length > 1) {
        for (let i = 0; i < particle.trail.length - 1; i++) {
          const trailOpacity = (particle.trail.length - i) / particle.trail.length * 0.3;
          ctx.globalAlpha = trailOpacity;
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = particle.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.trail[i].x, particle.trail[i].y);
          ctx.lineTo(particle.trail[i + 1].x, particle.trail[i + 1].y);
          ctx.stroke();
        }
      }
      
      // Draw particle
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.globalAlpha = particle.opacity * 0.3;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;
  }, [config, mode]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    updateParticles(canvas);
    drawParticles(ctx, canvas);
    
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      isMoving: true,
    };
    
    // Reset moving flag after a delay
    setTimeout(() => {
      mouseRef.current.isMoving = false;
    }, 100);
  }, []);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    initializeParticles(canvas);
  }, [initializeParticles]);

  // Initialize
  useEffect(() => {
    setIsClient(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    handleResize();
    animate();
    
    // Event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, handleMouseMove, handleResize]);

  // Don't render on server to prevent hydration issues
  if (!isClient) {
    return <Box sx={[{ width: '100%', height: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other} />;
  }

  return (
    <Box
      sx={[
        {
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------
// Preset components for easy use

export function CosmicParticles(props: Omit<ParticleSystemProps, 'preset'>) {
  return <ParticleSystem preset="cosmic" {...props} />;
}

export function NeuralParticles(props: Omit<ParticleSystemProps, 'preset'>) {
  return <ParticleSystem preset="neural" {...props} />;
}

export function EnergyParticles(props: Omit<ParticleSystemProps, 'preset'>) {
  return <ParticleSystem preset="energy" {...props} />;
}

export function MinimalParticles(props: Omit<ParticleSystemProps, 'preset'>) {
  return <ParticleSystem preset="minimal" {...props} />;
}

// ----------------------------------------------------------------------
// Usage examples and presets

export const particlePresetExamples = {
  // Hero section background
  heroBackground: {
    preset: 'cosmic' as const,
    particleCount: 60,
    enableTrail: true,
    enableConnections: true,
    sx: { position: 'absolute', top: 0, left: 0, zIndex: -1 },
  },
  
  // Interactive section
  interactive: {
    preset: 'energy' as const,
    particleCount: 80,
    interactionRadius: 150,
    enableTrail: true,
    sx: { height: '400px' },
  },
  
  // Subtle background
  subtle: {
    preset: 'minimal' as const,
    particleCount: 25,
    speed: 0.1,
    sx: { opacity: 0.6 },
  },
  
  // Neural network style
  neuralNetwork: {
    preset: 'neural' as const,
    enableConnections: true,
    connectionDistance: 120,
    colors: ['#3b82f6', '#8b5cf6'],
    sx: { height: '300px' },
  },
};

// ----------------------------------------------------------------------
// Easy preset components

export function HeroParticles(props: Omit<ParticleSystemProps, keyof Omit<typeof particlePresetExamples.heroBackground, 'sx'>>) {
  return <ParticleSystem {...particlePresetExamples.heroBackground} {...props} />;
}

export function InteractiveParticles(props: Omit<ParticleSystemProps, keyof Omit<typeof particlePresetExamples.interactive, 'sx'>>) {
  return <ParticleSystem {...particlePresetExamples.interactive} {...props} />;
}

export function SubtleParticles(props: Omit<ParticleSystemProps, keyof Omit<typeof particlePresetExamples.subtle, 'sx'>>) {
  return <ParticleSystem {...particlePresetExamples.subtle} {...props} />;
}

export function NeuralNetworkParticles(props: Omit<ParticleSystemProps, keyof Omit<typeof particlePresetExamples.neuralNetwork, 'sx'>>) {
  return <ParticleSystem {...particlePresetExamples.neuralNetwork} {...props} />;
}
