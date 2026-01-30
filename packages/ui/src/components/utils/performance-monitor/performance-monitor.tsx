'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import { useColorScheme, useTheme } from '@mui/material/styles';

import { Iconify } from '../../data-display/iconify';

// ----------------------------------------------------------------------

interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    limit: number;
  } | null;
  renderTime: number;
  domNodes: number;
  timestamp: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showChart?: boolean;
  onToggleChart?: (show: boolean) => void;
}

// ----------------------------------------------------------------------

export function PerformanceMonitor({ enabled = false, showChart = false, onToggleChart }: PerformanceMonitorProps) {
  // Early return for SSR
  if (typeof window === 'undefined') {
    return null;
  }

  const { mode } = useColorScheme() || { mode: 'light' };
  const theme = useTheme();
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: null,
    renderTime: 0,
    domNodes: 0,
    timestamp: Date.now(),
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [chartData, setChartData] = useState<{
    fps: number[];
    memory: number[];
    renderTime: number[];
    timestamps: number[];
  }>({
    fps: [],
    memory: [],
    renderTime: [],
    timestamps: [],
  });
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const renderStartRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const chartUpdateRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const maxDataPoints = 300; // 5 minutes * 60 seconds = 300 data points

  // FPS calculation
  const calculateFPS = useCallback(() => {
    frameCountRef.current++;
    const now = Date.now();
    const delta = now - lastTimeRef.current;
    
    if (delta >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / delta);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
      return fps;
    }
    
    return metrics.fps;
  }, [metrics.fps]);

  // Memory usage (if available)
  const getMemoryInfo = useCallback(() => {
    if (typeof window !== 'undefined' && typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
    }
    return null;
  }, []);

  // Render time calculation
  const calculateRenderTime = useCallback(() => {
    if (renderStartRef.current > 0) {
      return Date.now() - renderStartRef.current;
    }
    return 0;
  }, []);

  // DOM nodes count
  const getDOMNodesCount = useCallback(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return document.querySelectorAll('*').length;
    }
    return 0;
  }, []);

  // Update chart data every second
  const updateChartData = useCallback(() => {
    if (!enabled || !showChart) return;

    const currentMetrics = {
      fps: calculateFPS(),
      memory: getMemoryInfo(),
      renderTime: calculateRenderTime(),
      domNodes: getDOMNodesCount(),
      timestamp: Date.now(),
    };

    setChartData(prev => {
      const newData = {
        fps: [...prev.fps, currentMetrics.fps].slice(-maxDataPoints),
        memory: [...prev.memory, currentMetrics.memory?.used || 0].slice(-maxDataPoints),
        renderTime: [...prev.renderTime, currentMetrics.renderTime].slice(-maxDataPoints),
        timestamps: [...prev.timestamps, currentMetrics.timestamp].slice(-maxDataPoints),
      };
      return newData;
    });
  }, [enabled, showChart, calculateFPS, getMemoryInfo, calculateRenderTime, getDOMNodesCount]);

  // Update metrics
  const updateMetrics = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    renderStartRef.current = Date.now();
    
    const newMetrics: PerformanceMetrics = {
      fps: calculateFPS(),
      memory: getMemoryInfo(),
      renderTime: calculateRenderTime(),
      domNodes: getDOMNodesCount(),
      timestamp: Date.now(),
    };
    
    setMetrics(newMetrics);
    
    if (typeof requestAnimationFrame !== 'undefined') {
      animationFrameRef.current = requestAnimationFrame(updateMetrics);
    }
  }, [enabled, calculateFPS, getMemoryInfo, calculateRenderTime, getDOMNodesCount]);

  // Start/stop monitoring
  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      updateMetrics();
    } else if (animationFrameRef.current && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    return () => {
      if (animationFrameRef.current && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, updateMetrics]);

  // Start/stop chart updates
  useEffect(() => {
    if (enabled && showChart) {
      // Update chart immediately
      updateChartData();
      // Then update every second
      chartUpdateRef.current = setInterval(updateChartData, 1000);
    } else if (chartUpdateRef.current) {
      clearInterval(chartUpdateRef.current);
    }
    
    return () => {
      if (chartUpdateRef.current) {
        clearInterval(chartUpdateRef.current);
      }
    };
  }, [enabled, showChart, updateChartData]);

  // Toggle expanded view
  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Format memory size
  const formatMemory = (mb: number) => {
    if (mb > 1024) {
      return `${(mb / 1024).toFixed(1)}GB`;
    }
    return `${mb}MB`;
  };

  // Get FPS color based on performance
  const getFPSColor = (fps: number) => {
    if (fps >= 55) return '#10b981'; // Green
    if (fps >= 30) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  // Get memory color based on usage
  const getMemoryColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage < 60) return '#10b981'; // Green
    if (percentage < 80) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  if (!enabled) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
      }}
    >
      <Paper
        component={m.div}
        layout
        sx={{
          p: 1.5,
          minWidth: isExpanded ? 280 : 120,
          bgcolor: 'background.paper',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Stack spacing={1}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8 }}>
              Performance
            </Typography>
            <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
              <IconButton size="small" onClick={toggleExpanded}>
                <Iconify 
                  icon={isExpanded ? "solar:eye-closed-bold" : "solar:eye-bold"} 
                  width={14} 
                />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Metrics */}
          <Stack spacing={0.5}>
            <AnimatePresence>
              {isExpanded && (
                <m.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Stack spacing={0.5}>
                    {/* Chart Toggle */}
                    {onToggleChart && (
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          Chart
                        </Typography>
                        <Switch
                          size="small"
                          checked={showChart}
                          onChange={(e) => onToggleChart(e.target.checked)}
                        />
                      </Stack>
                    )}
                  </Stack>
                </m.div>
              )}
            </AnimatePresence>

            {/* FPS */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                FPS
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 600,
                  color: getFPSColor(metrics.fps),
                }}
              >
                {metrics.fps}
              </Typography>
            </Stack>

            <AnimatePresence>
              {isExpanded && (
                <m.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Stack spacing={0.5}>

                    {/* Memory */}
                    {metrics.memory && (
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          Memory
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 600,
                            color: getMemoryColor(metrics.memory.used, metrics.memory.limit),
                          }}
                        >
                          {formatMemory(metrics.memory.used)}
                        </Typography>
                      </Stack>
                    )}

                    {/* Render Time */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Render
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 600,
                          color: metrics.renderTime > 16 ? '#ef4444' : '#10b981',
                        }}
                      >
                        {metrics.renderTime}ms
                      </Typography>
                    </Stack>

                    {/* DOM Nodes */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        DOM
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 600,
                          color: metrics.domNodes > 1000 ? '#f59e0b' : '#10b981',
                        }}
                      >
                        {metrics.domNodes.toLocaleString()}
                      </Typography>
                    </Stack>

                    {/* Memory Details */}
                    {metrics.memory && (
                      <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.65rem' }}>
                              Total
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                              {formatMemory(metrics.memory.total)}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.65rem' }}>
                              Limit
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                              {formatMemory(metrics.memory.limit)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </m.div>
              )}
            </AnimatePresence>
          </Stack>

          {/* Chart */}
          <AnimatePresence>
            {showChart && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8, mb: 1, display: 'block' }}>
                    Performance Chart
                  </Typography>
                  <Box sx={{ height: 200, width: '100%', bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Chart
                      options={{
                        chart: {
                          type: 'line',
                          height: 200,
                          background: 'transparent',
                          toolbar: { show: false },
                          animations: { 
                            enabled: true,
                            speed: 800,
                            animateGradually: {
                              enabled: true,
                              delay: 150
                            },
                            dynamicAnimation: {
                              enabled: true,
                              speed: 350
                            }
                          },
                        },
                        theme: {
                          mode: mode === 'system' ? 'light' : mode,
                        },
                        stroke: {
                          curve: 'smooth',
                          width: 2,
                        },
                        colors: ['#10b981', '#f59e0b', '#ef4444'],
                        xaxis: {
                          type: 'datetime',
                          labels: { 
                            show: false,
                            style: {
                              colors: mode === 'dark' ? '#9ca3af' : '#6b7280'
                            }
                          },
                          axisBorder: { show: false },
                          axisTicks: { show: false },
                        },
                        yaxis: {
                          title: { 
                            text: 'Value', 
                            style: { 
                              fontSize: '10px',
                              color: mode === 'dark' ? '#9ca3af' : '#6b7280'
                            } 
                          },
                          min: 0,
                          labels: {
                            style: {
                              colors: mode === 'dark' ? '#9ca3af' : '#6b7280'
                            }
                          }
                        },
                        legend: {
                          show: true,
                          position: 'top',
                          fontSize: '10px',
                          labels: {
                            colors: mode === 'dark' ? '#f3f4f6' : '#374151'
                          }
                        },
                        grid: {
                          borderColor: mode === 'dark' ? '#374151' : '#e5e7eb',
                          strokeDashArray: 3,
                        },
                        tooltip: {
                          theme: mode === 'dark' ? 'dark' : 'light',
                        }
                      }}
                      series={[
                        {
                          name: 'FPS',
                          data: chartData.fps.map((fps, index) => [chartData.timestamps[index], fps]),
                        },
                        {
                          name: 'Memory',
                          data: chartData.memory.map((mem, index) => [chartData.timestamps[index], mem]),
                        },
                        {
                          name: 'Render Time',
                          data: chartData.renderTime.map((time, index) => [chartData.timestamps[index], time]),
                        },
                      ]}
                      type="line"
                      height={200}
                    />
                  </Box>
                </Box>
              </m.div>
            )}
          </AnimatePresence>
        </Stack>
      </Paper>
    </Box>
  );
}
