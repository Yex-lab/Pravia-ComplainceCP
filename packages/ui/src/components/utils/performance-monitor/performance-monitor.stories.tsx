// @ts-nocheck
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

import { PerformanceMonitor } from './performance-monitor';

export default {
  title: 'Utils/Performance Monitor',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  render: () => (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Performance Monitor - Default
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Performance monitor is disabled by default. Check bottom-right corner when enabled.
      </Typography>
      <PerformanceMonitor enabled={true} />
    </Container>
  ),
};

export const ConfigurationControls = {
  render: () => {
    const [enabled, setEnabled] = useState(true);
    const [showChart, setShowChart] = useState(false);
    const [heavyLoad, setHeavyLoad] = useState(false);

    const createHeavyLoad = () => {
      setHeavyLoad(true);
      // Create DOM elements to increase DOM node count
      const container = document.createElement('div');
      container.style.display = 'none';
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.textContent = `Heavy load element ${i}`;
        container.appendChild(div);
      }
      document.body.appendChild(container);

      // Heavy computation to affect FPS
      const heavyComputation = () => {
        for (let i = 0; i < 1000000; i++) {
          Math.random() * Math.random();
        }
        if (heavyLoad) {
          requestAnimationFrame(heavyComputation);
        }
      };
      heavyComputation();

      // Clean up after 5 seconds
      setTimeout(() => {
        setHeavyLoad(false);
        document.body.removeChild(container);
      }, 5000);
    };

    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Performance Monitor - Configuration
        </Typography>
        
        <Stack spacing={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Controls
            </Typography>
            
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                }
                label="Enable Performance Monitor"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showChart}
                    onChange={(e) => setShowChart(e.target.checked)}
                    disabled={!enabled}
                  />
                }
                label="Show Performance Chart"
              />
              
              <Button 
                variant="contained" 
                onClick={createHeavyLoad}
                disabled={heavyLoad}
                sx={{ alignSelf: 'flex-start' }}
              >
                {heavyLoad ? 'Creating Heavy Load...' : 'Create Heavy Load (5s)'}
              </Button>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              What to Expect
            </Typography>
            
            <Stack spacing={1}>
              <Typography variant="body2">
                • <strong>FPS:</strong> Green (55+), Yellow (30-54), Red (&lt;30)
              </Typography>
              <Typography variant="body2">
                • <strong>Memory:</strong> Shows JS heap usage (Chrome only)
              </Typography>
              <Typography variant="body2">
                • <strong>Render:</strong> Time to render frame (Green &lt;16ms, Red &gt;16ms)
              </Typography>
              <Typography variant="body2">
                • <strong>DOM:</strong> Total DOM nodes (Green &lt;1000, Yellow &gt;1000)
              </Typography>
              <Typography variant="body2">
                • Click the expand button to see detailed metrics
              </Typography>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Usage
            </Typography>
            
            <Box component="pre" sx={{ 
              bgcolor: 'grey.100', 
              p: 2, 
              borderRadius: 1, 
              overflow: 'auto',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}>
{`// Enable performance monitoring
<PerformanceMonitor enabled={true} />

// Disable performance monitoring (default)
<PerformanceMonitor enabled={false} />
<PerformanceMonitor /> // same as above`}
            </Box>
          </Card>
        </Stack>

        <PerformanceMonitor 
          enabled={enabled} 
          showChart={showChart} 
          onToggleChart={setShowChart}
        />
      </Container>
    );
  },
};

export const EnabledOnly = {
  render: () => (
    <Box sx={{ minHeight: '100vh', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Performance Monitor - Always Enabled
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Check the bottom-right corner for the performance monitor.
        Try scrolling, clicking, or interacting with the page to see metrics change.
      </Typography>
      <PerformanceMonitor enabled={true} />
    </Box>
  ),
};

export const WithChart = {
  render: () => {
    const [showChart, setShowChart] = useState(true);
    
    return (
      <Box sx={{ minHeight: '100vh', p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Performance Monitor - With Chart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Performance monitor with chart toggle icon. Click the chart icon to toggle.
        </Typography>
        <PerformanceMonitor 
          enabled={true} 
          showChart={showChart} 
          onToggleChart={setShowChart}
        />
      </Box>
    );
  },
};
