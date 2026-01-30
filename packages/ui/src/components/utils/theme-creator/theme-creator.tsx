'use client';

import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { Iconify } from '../../data-display/iconify';

// ----------------------------------------------------------------------

const PRESETS = {
  'faro-1': { 
    name: 'FARO 1',
    primary: { lighter: '#EAEEF6', light: '#8FA4CE', main: '#435F97', dark: '#5A78B6', darker: '#DBE5F0' },
    secondary: { lighter: '#FDE7D7', light: '#F8AC74', main: '#F4791F', dark: '#E1660B', darker: '#A84C08' },
  },
  'faro-2': { 
    name: 'FARO 2',
    primary: { lighter: '#FDE7D7', light: '#F8AC74', main: '#F4791F', dark: '#E1660B', darker: '#A84C08' },
    secondary: { lighter: '#EAEEF6', light: '#8FA4CE', main: '#435F97', dark: '#5A78B6', darker: '#DBE5F0' },
  },
  'ocean-blue': { 
    name: 'Ocean Blue',
    primary: { lighter: '#CCF4FE', light: '#68CDF9', main: '#078DEE', dark: '#0351AB', darker: '#012972' },
    secondary: { lighter: '#CAFDEB', light: '#61F4D9', main: '#00DCDA', dark: '#00849E', darker: '#004569' },
  },
  'royal-purple': { 
    name: 'Royal Purple',
    primary: { lighter: '#EBD6FD', light: '#B985F4', main: '#7635dc', dark: '#431A9E', darker: '#200A69' },
    secondary: { lighter: '#D6E5FD', light: '#85A9F3', main: '#3562D7', dark: '#1A369A', darker: '#0A1967' },
  },
  'deep-cyan': { 
    name: 'Deep Cyan',
    primary: { lighter: '#CDE9FD', light: '#6BB1F8', main: '#0C68E9', dark: '#063BA7', darker: '#021D6F' },
    secondary: { lighter: '#FFF3D8', light: '#FFD18B', main: '#FFA03F', dark: '#B75D1F', darker: '#7A2D0C' },
  },
  'sunset-orange': { 
    name: 'Sunset Orange',
    primary: { lighter: '#FEF4D4', light: '#FED680', main: '#fda92d', dark: '#B76816', darker: '#793908' },
    secondary: { lighter: '#FEEFD5', light: '#FBC182', main: '#F37F31', dark: '#AE4318', darker: '#741B09' },
  },
  'crimson-red': { 
    name: 'Crimson Red',
    primary: { lighter: '#FFE3D5', light: '#FFC1AC', main: '#FF3030', dark: '#B71833', darker: '#7A0930' },
    secondary: { lighter: '#FCF0DA', light: '#EEC18D', main: '#C87941', dark: '#904220', darker: '#601B0C' },
  },
  'forest-green': { 
    name: 'Forest Green',
    primary: { lighter: '#D8FBDE', light: '#86E8AB', main: '#22C55E', dark: '#118D57', darker: '#065E49' },
    secondary: { lighter: '#D3FCD2', light: '#77ED8B', main: '#22C55E', dark: '#118D57', darker: '#065E49' },
  },
  'midnight-dark': { 
    name: 'Midnight Dark',
    primary: { lighter: '#637381', light: '#454F5B', main: '#1C252E', dark: '#141A21', darker: '#0A0D10' },
    secondary: { lighter: '#C4CDD5', light: '#919EAB', main: '#637381', dark: '#454F5B', darker: '#1C252E' },
  },
  'emerald-teal': { 
    name: 'Emerald Teal',
    primary: { lighter: '#CAFDF5', light: '#61F3F3', main: '#00B8D9', dark: '#006C9C', darker: '#003768' },
    secondary: { lighter: '#D3FCD2', light: '#77ED8B', main: '#22C55E', dark: '#118D57', darker: '#065E49' },
  },
  'amber-gold': { 
    name: 'Amber Gold',
    primary: { lighter: '#FFF5CC', light: '#FFD666', main: '#FFAB00', dark: '#B76E00', darker: '#7A4100' },
    secondary: { lighter: '#FEF4D4', light: '#FED680', main: '#fda92d', dark: '#B76816', darker: '#793908' },
  },
  'rose-pink': { 
    name: 'Rose Pink',
    primary: { lighter: '#FFE9D5', light: '#FFAC82', main: '#FF5630', dark: '#B71D18', darker: '#7A0916' },
    secondary: { lighter: '#EFD6FF', light: '#C684FF', main: '#8E33FF', dark: '#5119B7', darker: '#27097A' },
  },
};

export type ColorShades = {
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
};

export type ThemeColors = {
  primary: ColorShades;
  secondary: ColorShades;
  textPrimary?: string;
  textSecondary?: string;
  textDisabled?: string;
  success?: string;
  info?: string;
  warning?: string;
  error?: string;
};

export type ThemeCreatorProps = {
  onApply?: (colors: ThemeColors) => void;
};

export function ThemeCreator({ onApply }: ThemeCreatorProps) {
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('faro-1');
  const [colors, setColors] = useState<ThemeColors>({
    primary: { ...PRESETS['faro-1'].primary },
    secondary: { ...PRESETS['faro-1'].secondary },
    textPrimary: '#1C252E',
    textSecondary: '#637381',
    textDisabled: '#919EAB',
    success: '#22C55E',
    info: '#00B8D9',
    warning: '#FFAB00',
    error: '#FF5630',
  });

  const handleApply = () => {
    onApply?.(colors);
    setOpen(false);
  };

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = PRESETS[presetKey as keyof typeof PRESETS];
    setColors({
      ...colors,
      primary: { ...preset.primary },
      secondary: { ...preset.secondary },
    });
  };

  const updateColor = (type: 'primary' | 'secondary', shade: keyof ColorShades, value: string) => {
    setColors({
      ...colors,
      [type]: { ...colors[type], [shade]: value },
    });
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="inherit">
        <Iconify icon="solar:palette-bold-duotone" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="solar:palette-bold-duotone" width={24} />
            Theme Creator
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2.5}>
            {/* Preset Dropdown */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 13 }}>Preset</Typography>
              <TextField
                select
                fullWidth
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                size="small"
              >
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <MenuItem key={key} value={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: 0.5,
                          bgcolor: preset.primary.main,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                      {preset.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Primary Color */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 13 }}>Primary</Typography>
              <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                {(Object.keys(colors.primary) as Array<keyof ColorShades>).map((shade) => (
                  <input
                    key={shade}
                    type="color"
                    value={colors.primary[shade]}
                    onChange={(e) => updateColor('primary', shade, e.target.value)}
                    style={{
                      width: '20%',
                      height: 36,
                      border: '2px solid #ddd',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                {colors.primary.main}
              </Typography>
            </Box>

            {/* Secondary Color */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 13 }}>Secondary</Typography>
              <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                {(Object.keys(colors.secondary) as Array<keyof ColorShades>).map((shade) => (
                  <input
                    key={shade}
                    type="color"
                    value={colors.secondary[shade]}
                    onChange={(e) => updateColor('secondary', shade, e.target.value)}
                    style={{
                      width: '20%',
                      height: 36,
                      border: '2px solid #ddd',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                {colors.secondary.main}
              </Typography>
            </Box>

            {/* Text Colors */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 13 }}>Text Colors</Typography>
              <Stack spacing={1}>
                {[
                  { label: 'Primary', key: 'textPrimary' as const },
                  { label: 'Secondary', key: 'textSecondary' as const },
                  { label: 'Disabled', key: 'textDisabled' as const },
                ].map(({ label, key }) => (
                  <Stack key={key} direction="row" spacing={1} alignItems="center">
                    <input
                      type="color"
                      value={colors[key]}
                      onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                      style={{
                        width: 32,
                        height: 32,
                        border: '2px solid #ddd',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ fontSize: 12 }}>{label}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontSize: 10, color: 'text.secondary' }}>
                        {colors[key]}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>

            {/* Status Colors */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 13 }}>Status</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {[
                  { label: 'Success', key: 'success' as const, icon: 'eva:checkmark-circle-2-fill' },
                  { label: 'Info', key: 'info' as const, icon: 'eva:info-fill' },
                  { label: 'Warning', key: 'warning' as const, icon: 'eva:alert-triangle-fill' },
                  { label: 'Error', key: 'error' as const, icon: 'eva:close-circle-fill' },
                ].map(({ label, key, icon }) => (
                  <Stack key={key} direction="row" spacing={0.5} alignItems="center">
                    <input
                      type="color"
                      value={colors[key]}
                      onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                      style={{
                        width: 28,
                        height: 28,
                        border: '2px solid #ddd',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    />
                    <Box>
                      <Typography variant="caption" sx={{ fontSize: 11 }}>{label}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontSize: 9, color: 'text.secondary' }}>
                        {colors[key]}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Box>
            </Box>

            {/* Preview */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 13 }}>Preview</Typography>
              <Box sx={{ p: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={0.5}>
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ 
                        bgcolor: colors.primary.main, 
                        fontSize: 11, 
                        py: 0.5,
                        '&:hover': { bgcolor: colors.primary.dark }
                      }}
                    >
                      Primary
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ 
                        bgcolor: colors.secondary.main, 
                        fontSize: 11, 
                        py: 0.5,
                        '&:hover': { bgcolor: colors.secondary.dark }
                      }}
                    >
                      Secondary
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ 
                        borderColor: colors.primary.main, 
                        color: colors.primary.main, 
                        fontSize: 11, 
                        py: 0.5,
                        '&:hover': { 
                          borderColor: colors.primary.dark,
                          bgcolor: `${colors.primary.main}10`
                        }
                      }}
                    >
                      Outlined
                    </Button>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Alert severity="success" sx={{ py: 0, '& .MuiAlert-message': { fontSize: 11 }, '& .MuiAlert-icon': { color: colors.success } }}>Success</Alert>
                    <Alert severity="info" sx={{ py: 0, '& .MuiAlert-message': { fontSize: 11 }, '& .MuiAlert-icon': { color: colors.info } }}>Info</Alert>
                    <Alert severity="warning" sx={{ py: 0, '& .MuiAlert-message': { fontSize: 11 }, '& .MuiAlert-icon': { color: colors.warning } }}>Warning</Alert>
                    <Alert severity="error" sx={{ py: 0, '& .MuiAlert-message': { fontSize: 11 }, '& .MuiAlert-icon': { color: colors.error } }}>Error</Alert>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit" size="small">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleApply} size="small">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export type { ThemeColors as CustomThemeColors };
