'use client';

import { useMemo, useState, useEffect } from 'react';
import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import { useColorScheme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

export interface NeuralNetworkNode {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export interface NeuralNetworkProps {
  nodeCount?: number;
  connectionDistance?: number;
  opacity?: {
    dark: number;
    light: number;
  };
  nodeSize?: {
    xs: number;
    md: number;
  };
  lineOpacity?: number;
  lineWidth?: number;
  animationDuration?: number;
  className?: string;
  sx?: any;
  seed?: number; // Add seed for deterministic generation
}

// ----------------------------------------------------------------------

// Seeded random number generator for consistent results
function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function NeuralNetwork({
  nodeCount = 16,
  connectionDistance = 35,
  opacity = { dark: 0.6, light: 0.4 },
  nodeSize = { xs: 3, md: 5 },
  lineOpacity = 0.7,
  lineWidth = 1.5,
  animationDuration = 4,
  className,
  sx,
  seed = 12345, // Default seed for consistency
}: NeuralNetworkProps) {
  const { mode } = useColorScheme();
  const theme = useTheme();
  const [isClient, setIsClient] = useState(false);
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Ensure this only runs on client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Responsive configuration based on screen size
  const responsiveConfig = useMemo(() => {
    if (isMobile) {
      return {
        nodeCount: Math.max(8, Math.floor(nodeCount * 0.5)), // Reduce nodes on mobile
        connectionDistance: connectionDistance * 0.7, // Reduce connection distance
        nodeSpacing: { x: 15, y: 20 }, // More spacing between nodes
        margins: { x: 10, y: 15 }, // Margins from edges
      };
    } else if (isTablet) {
      return {
        nodeCount: Math.max(12, Math.floor(nodeCount * 0.75)), // Moderate reduction on tablet
        connectionDistance: connectionDistance * 0.85,
        nodeSpacing: { x: 10, y: 15 },
        margins: { x: 8, y: 12 },
      };
    } else {
      return {
        nodeCount: nodeCount,
        connectionDistance: connectionDistance,
        nodeSpacing: { x: 5, y: 10 },
        margins: { x: 5, y: 8 },
      };
    }
  }, [isMobile, isTablet, nodeCount, connectionDistance]);

  // Generate neural network nodes with seeded random (memoized for performance)
  const nodes = useMemo(() => {
    if (!isClient) return []; // Return empty array during SSR
    
    const generatedNodes: NeuralNetworkNode[] = [];
    const { nodeCount: adjustedNodeCount, nodeSpacing, margins } = responsiveConfig;
    
    for (let i = 0; i < adjustedNodeCount; i++) {
      const seedX = seed + i * 2;
      const seedY = seed + i * 2 + 1;
      const seedDelay = seed + i * 3;
      const seedDuration = seed + i * 4;
      
      // Better distribution with margins and spacing
      const baseX = margins.x + seededRandom(seedX) * (100 - 2 * margins.x);
      const baseY = margins.y + seededRandom(seedY) * (100 - 2 * margins.y);
      
      // Apply spacing to prevent clustering
      const x = Math.max(margins.x, Math.min(100 - margins.x, baseX));
      const y = Math.max(margins.y, Math.min(100 - margins.y, baseY));
      
      generatedNodes.push({
        id: i,
        x,
        y,
        delay: seededRandom(seedDelay) * 3,
        duration: 3 + seededRandom(seedDuration) * 2,
      });
    }
    return generatedNodes;
  }, [responsiveConfig, seed, isClient]);

  // Calculate connections between nodes
  const connections = useMemo(() => {
    if (!isClient || nodes.length === 0) return [];
    
    const nodeConnections: Array<{
      from: NeuralNetworkNode;
      to: NeuralNetworkNode;
      distance: number;
      delay: number;
    }> = [];

    const { connectionDistance: adjustedConnectionDistance } = responsiveConfig;

    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach((targetNode, j) => {
        const distance = Math.sqrt(
          Math.pow(node.x - targetNode.x, 2) + Math.pow(node.y - targetNode.y, 2)
        );
        
        if (distance < adjustedConnectionDistance) {
          nodeConnections.push({
            from: node,
            to: targetNode,
            distance,
            delay: (i + j) * 0.15,
          });
        }
      });
    });

    return nodeConnections;
  }, [nodes, responsiveConfig, isClient]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <Box
      className={className}
      sx={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          opacity: mode === 'dark' ? opacity.dark : opacity.light,
          zIndex: 1,
          pointerEvents: 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Connection Lines */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        }}
      >
        {connections.map((connection, index) => (
          <m.line
            key={`connection-${index}`}
            x1={`${connection.from.x}%`}
            y1={`${connection.from.y}%`}
            x2={`${connection.to.x}%`}
            y2={`${connection.to.y}%`}
            stroke={mode === 'dark' ? '#3a86ff' : '#8338ec'}
            strokeWidth={isMobile ? lineWidth * 0.8 : lineWidth} // Thinner lines on mobile
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, lineOpacity, 0],
            }}
            transition={{
              duration: animationDuration,
              delay: connection.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Neural Nodes */}
      {nodes.map((node) => (
        <Box
          key={`node-${node.id}`}
          component={m.div}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: node.duration,
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          sx={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: { xs: nodeSize.xs, md: nodeSize.md },
            height: { xs: nodeSize.xs, md: nodeSize.md },
            borderRadius: '50%',
            background: (theme) => mode === 'dark'
              ? `radial-gradient(circle, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              : `radial-gradient(circle, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            boxShadow: (theme) => mode === 'dark'
              ? `0 0 ${isMobile ? '15px' : '20px'} ${theme.palette.primary.main}66, 0 0 ${isMobile ? '30px' : '40px'} ${theme.palette.primary.main}33`
              : `0 0 ${isMobile ? '10px' : '15px'} ${theme.palette.primary.main}55, 0 0 ${isMobile ? '20px' : '30px'} ${theme.palette.primary.main}22`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Preset configurations for easy use

export const neuralNetworkPresets = {
  subtle: {
    nodeCount: 8,
    connectionDistance: 25,
    opacity: { dark: 0.3, light: 0.15 },
    nodeSize: { xs: 2, md: 3 },
    lineOpacity: 0.4,
    lineWidth: 1,
    seed: 11111,
  },
  
  standard: {
    nodeCount: 16,
    connectionDistance: 35,
    opacity: { dark: 0.6, light: 0.4 },
    nodeSize: { xs: 3, md: 5 },
    lineOpacity: 0.7,
    lineWidth: 1.5,
    seed: 12345,
  },
  
  prominent: {
    nodeCount: 24,
    connectionDistance: 40,
    opacity: { dark: 0.8, light: 0.6 },
    nodeSize: { xs: 4, md: 7 },
    lineOpacity: 0.9,
    lineWidth: 2,
    seed: 13579,
  },
  
  dense: {
    nodeCount: 32,
    connectionDistance: 30,
    opacity: { dark: 0.7, light: 0.5 },
    nodeSize: { xs: 2, md: 4 },
    lineOpacity: 0.6,
    lineWidth: 1,
    seed: 24680,
  },
} as const;

// ----------------------------------------------------------------------
// Easy-to-use wrapper components

export function SubtleNeuralNetwork(props: Omit<NeuralNetworkProps, keyof Omit<typeof neuralNetworkPresets.subtle, 'sx'>>) {
  return <NeuralNetwork {...neuralNetworkPresets.subtle} {...props} />;
}

export function StandardNeuralNetwork(props: Omit<NeuralNetworkProps, keyof Omit<typeof neuralNetworkPresets.standard, 'sx'>>) {
  return <NeuralNetwork {...neuralNetworkPresets.standard} {...props} />;
}

export function ProminentNeuralNetwork(props: Omit<NeuralNetworkProps, keyof Omit<typeof neuralNetworkPresets.prominent, 'sx'>>) {
  return <NeuralNetwork {...neuralNetworkPresets.prominent} {...props} />;
}

export function DenseNeuralNetwork(props: Omit<NeuralNetworkProps, keyof Omit<typeof neuralNetworkPresets.dense, 'sx'>>) {
  return <NeuralNetwork {...neuralNetworkPresets.dense} {...props} />;
}
