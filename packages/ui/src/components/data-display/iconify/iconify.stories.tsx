import type { Meta, StoryObj } from '@storybook/react-vite';
import { Iconify } from './iconify';
import { allIconNames } from './register-icons';
import { Typography, Box } from '@mui/material';

const meta: Meta<typeof Iconify> = {
  title: 'Data Display/Iconify',
  component: Iconify,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Iconify>;

export const SingleIcon: Story = {
  args: {
    icon: 'solar:heart-bold',
    width: 24,
  },
};

export const AllIcons: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {allIconNames.map((iconName) => (
        <Box key={iconName} sx={{ flex: '0 0 calc(25% - 12px)', minWidth: 120 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              minHeight: 80,
            }}
          >
            <Iconify icon={iconName} width={32} />
            <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
              {iconName}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

export const SolarBoldIcons: Story = {
  render: () => {
    const boldIcons = allIconNames.filter(name => name.startsWith('solar:') && name.includes('-bold') && !name.includes('duotone'));
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {boldIcons.map((iconName) => (
          <Box key={iconName} sx={{ flex: '0 0 calc(25% - 12px)', minWidth: 120 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                minHeight: 80,
              }}
            >
              <Iconify icon={iconName} width={32} />
              <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
                {iconName.replace('solar:', '')}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  },
};

export const SolarDuotoneIcons: Story = {
  render: () => {
    const duotoneIcons = allIconNames.filter(name => name.startsWith('solar:') && name.includes('duotone'));
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {duotoneIcons.map((iconName) => (
          <Box key={iconName} sx={{ flex: '0 0 calc(25% - 12px)', minWidth: 120 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                minHeight: 80,
              }}
            >
              <Iconify icon={iconName} width={32} />
              <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
                {iconName.replace('solar:', '')}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  },
};

export const CustomIcons: Story = {
  render: () => {
    const customIcons = allIconNames.filter(name => name.startsWith('custom:'));
    const colors = ['#1976d2', '#d32f2f', '#388e3c', '#f57c00', '#7b1fa2'];
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {customIcons.map((iconName, index) => (
          <Box key={iconName} sx={{ flex: '0 0 calc(25% - 12px)', minWidth: 120 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                minHeight: 80,
              }}
            >
              <Iconify icon={iconName} width={32} sx={{ color: colors[index % colors.length] }} />
              <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
                {iconName.replace('custom:', '')}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  },
};
