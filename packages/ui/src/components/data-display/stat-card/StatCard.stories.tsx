import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './stat-card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const meta: Meta<typeof StatCard> = {
  title: 'Data Display/Stat Card',
  component: StatCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof StatCard>;

// ----------------------------------------------------------------------
// Basic Examples
// ----------------------------------------------------------------------

export const Default: Story = {
  args: {
    value: 18765,
    label: 'Total Active Users',
    icon: 'solar:users-group-rounded-bold-duotone',
    color: 'primary',
  },
};

export const WithTrend: Story = {
  args: {
    value: 18765,
    label: 'Total Active Users',
    icon: 'solar:users-group-rounded-bold-duotone',
    color: 'primary',
    trend: {
      value: 2.6,
      label: 'than last week',
    },
  },
};

export const WithChart: Story = {
  args: {
    value: 18765,
    label: 'Total Active Users',
    icon: 'solar:users-group-rounded-bold-duotone',
    color: 'primary',
    trend: {
      value: 2.6,
      label: 'than last week',
    },
    chart: {
      data: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
  },
};

export const NegativeTrend: Story = {
  args: {
    value: 4876,
    label: 'Weekly Sales',
    icon: 'solar:cart-large-4-bold-duotone',
    color: 'info',
    trend: {
      value: -0.5,
      label: 'than last week',
    },
  },
};

// ----------------------------------------------------------------------
// Layout Variations
// ----------------------------------------------------------------------

export const IconLeft: Story = {
  args: {
    value: 678,
    label: 'New Orders',
    icon: 'solar:bag-4-bold-duotone',
    color: 'success',
    layout: 'icon-left',
    trend: {
      value: 5.6,
      label: 'than yesterday',
    },
  },
};

export const IconRight: Story = {
  args: {
    value: 678,
    label: 'New Orders',
    icon: 'solar:bag-4-bold-duotone',
    color: 'success',
    layout: 'icon-right',
    trend: {
      value: 5.6,
      label: 'than yesterday',
    },
  },
};

export const IconTop: Story = {
  args: {
    value: 678,
    label: 'New Orders',
    icon: 'solar:bag-4-bold-duotone',
    color: 'success',
    layout: 'icon-top',
    trend: {
      value: 5.6,
      label: 'than yesterday',
    },
    chart: {
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
  },
};

// ----------------------------------------------------------------------
// Color Variations
// ----------------------------------------------------------------------

export const AllColors: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={18765}
          label="Primary"
          icon="solar:user-bold-duotone"
          color="primary"
          trend={{ value: 2.6, label: 'than last week' }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={4876}
          label="Secondary"
          icon="solar:star-bold-duotone"
          color="secondary"
          trend={{ value: -0.5, label: 'than last week' }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={678}
          label="Info"
          icon="solar:info-circle-bold-duotone"
          color="info"
          trend={{ value: 1.2, label: 'than last week' }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={12345}
          label="Success"
          icon="solar:check-circle-bold-duotone"
          color="success"
          trend={{ value: 3.8, label: 'than last week' }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={8901}
          label="Warning"
          icon="solar:danger-triangle-bold-duotone"
          color="warning"
          trend={{ value: 0.0, label: 'no change' }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={2345}
          label="Error"
          icon="solar:close-circle-bold-duotone"
          color="error"
          trend={{ value: -2.1, label: 'than last week' }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={5678}
          label="Default"
          icon="solar:widget-4-bold-duotone"
          color="default"
          trend={{ value: 1.5, label: 'than last week' }}
        />
      </Grid>
    </Grid>
  ),
};

// ----------------------------------------------------------------------
// Size Variations
// ----------------------------------------------------------------------

export const AllSizes: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <StatCard
          value={18765}
          label="Small Size"
          icon="solar:wallet-bold-duotone"
          color="primary"
          size="small"
          trend={{ value: 2.6, label: 'than last week' }}
        />
      </Grid>
      <Grid xs={12} md={4}>
        <StatCard
          value={18765}
          label="Medium Size"
          icon="solar:wallet-bold-duotone"
          color="primary"
          size="medium"
          trend={{ value: 2.6, label: 'than last week' }}
        />
      </Grid>
      <Grid xs={12} md={4}>
        <StatCard
          value={18765}
          label="Large Size"
          icon="solar:wallet-bold-duotone"
          color="primary"
          size="large"
          trend={{ value: 2.6, label: 'than last week' }}
        />
      </Grid>
    </Grid>
  ),
};

// ----------------------------------------------------------------------
// With Charts
// ----------------------------------------------------------------------

export const WithSparklineCharts: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={18765}
          label="Total Users"
          icon="solar:users-group-rounded-bold-duotone"
          color="primary"
          trend={{ value: 2.6, label: 'than last week' }}
          chart={{
            data: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={4876}
          label="Total Sales"
          icon="solar:dollar-minimalistic-bold-duotone"
          color="info"
          trend={{ value: -0.5, label: 'than last week' }}
          chart={{
            data: [40, 70, 50, 28, 70, 75, 7, 64, 38, 27],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={678}
          label="New Orders"
          icon="solar:bag-4-bold-duotone"
          color="success"
          trend={{ value: 5.6, label: 'than yesterday' }}
          chart={{
            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={12678}
          label="Bug Reports"
          icon="solar:bug-bold-duotone"
          color="error"
          trend={{ value: -1.2, label: 'than yesterday' }}
          chart={{
            data: [44, 55, 41, 64, 22, 43, 21, 32, 45, 22],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          }}
        />
      </Grid>
    </Grid>
  ),
};

// ----------------------------------------------------------------------
// Loading States
// ----------------------------------------------------------------------

export const LoadingStates: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={0}
          label="Loading Small"
          icon="solar:wallet-bold-duotone"
          color="primary"
          size="small"
          loading
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={0}
          label="Loading Medium"
          icon="solar:wallet-bold-duotone"
          color="primary"
          size="medium"
          loading
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={0}
          label="Loading Large"
          icon="solar:wallet-bold-duotone"
          color="primary"
          size="large"
          loading
        />
      </Grid>
    </Grid>
  ),
};

// ----------------------------------------------------------------------
// Interactive/Clickable
// ----------------------------------------------------------------------

export const Clickable: Story = {
  args: {
    value: 18765,
    label: 'Click me!',
    icon: 'solar:cursor-bold-duotone',
    color: 'primary',
    trend: {
      value: 2.6,
      label: 'than last week',
    },
    onClick: () => alert('StatCard clicked!'),
  },
};

// ----------------------------------------------------------------------
// Screenshot Examples (Matching the 8 variations from user's screenshot)
// ----------------------------------------------------------------------

export const ScreenshotVariations: Story = {
  render: () => (
    <Box>
      {/* Top Row - Icon Left with Trends */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={18765}
            label="Total Active Users"
            icon="solar:users-group-rounded-bold-duotone"
            color="primary"
            layout="icon-left"
            trend={{ value: 2.6, label: 'than last week' }}
            chart={{
              data: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={4876}
            label="Total Sales"
            icon="solar:dollar-minimalistic-bold-duotone"
            color="info"
            layout="icon-left"
            trend={{ value: -0.5, label: 'than last week' }}
            chart={{
              data: [40, 70, 50, 28, 70, 75, 7, 64, 38, 27],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={678}
            label="New Orders"
            icon="solar:bag-4-bold-duotone"
            color="success"
            layout="icon-left"
            trend={{ value: 5.6, label: 'than yesterday' }}
            chart={{
              data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={12678}
            label="Bug Reports"
            icon="solar:bug-bold-duotone"
            color="error"
            layout="icon-left"
            trend={{ value: -1.2, label: 'than yesterday' }}
            chart={{
              data: [44, 55, 41, 64, 22, 43, 21, 32, 45, 22],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            }}
          />
        </Grid>
      </Grid>

      {/* Bottom Row - Icon Right without Trends */}
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={18765}
            label="Weekly Sales"
            icon="solar:chart-2-bold-duotone"
            color="primary"
            layout="icon-right"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={4876}
            label="New Users"
            icon="solar:user-plus-bold-duotone"
            color="info"
            layout="icon-right"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={678}
            label="Item Orders"
            icon="solar:shopping-cart-bold-duotone"
            color="success"
            layout="icon-right"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={12678}
            label="Bug Reports"
            icon="solar:shield-warning-bold-duotone"
            color="error"
            layout="icon-right"
          />
        </Grid>
      </Grid>
    </Box>
  ),
};

// ----------------------------------------------------------------------
// Custom Value Formatting
// ----------------------------------------------------------------------

export const CustomFormatting: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={1234567.89}
          label="Currency"
          icon="solar:dollar-minimalistic-bold-duotone"
          color="success"
          formatValue={(val) => `$${(typeof val === 'number' ? val : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={0.856}
          label="Percentage"
          icon="solar:chart-square-bold-duotone"
          color="info"
          formatValue={(val) => `${((typeof val === 'number' ? val : 0) * 100).toFixed(1)}%`}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={1234567}
          label="Short Format"
          icon="solar:users-group-rounded-bold-duotone"
          color="primary"
          formatValue={(val) => {
            const num = typeof val === 'number' ? val : 0;
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
            return num.toString();
          }}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          value={123}
          label="Custom Text"
          icon="solar:clock-circle-bold-duotone"
          color="warning"
          formatValue={(val) => `${val} days`}
        />
      </Grid>
    </Grid>
  ),
};

// ----------------------------------------------------------------------
// No Icon
// ----------------------------------------------------------------------

export const WithoutIcon: Story = {
  args: {
    value: 18765,
    label: 'Total Revenue',
    color: 'primary',
    trend: {
      value: 12.5,
      label: 'than last month',
    },
  },
};

// ----------------------------------------------------------------------
// Custom Icons
// ----------------------------------------------------------------------

export const CustomIcon: Story = {
  args: {
    value: 18765,
    label: 'Custom Icon',
    color: 'primary',
    customIcon: (
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: 'success.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 14,
          fontWeight: 'bold',
        }}
      >
        ✓
      </Box>
    ),
    trend: {
      value: 2.6,
      label: 'than last week',
    },
  },
};

// ----------------------------------------------------------------------
// Real-world Dashboard Example
// ----------------------------------------------------------------------

export const DashboardExample: Story = {
  render: () => (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={765412}
            label="Total Revenue"
            icon="solar:dollar-minimalistic-bold-duotone"
            color="primary"
            trend={{ value: 12.5, label: 'than last month' }}
            formatValue={(val) => `$${(typeof val === 'number' ? val : 0).toLocaleString()}`}
            chart={{
              data: [31000, 40000, 28000, 51000, 42000, 109000, 100000, 120000, 87000, 93000, 102000, 105000],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={54238}
            label="New Customers"
            icon="solar:users-group-rounded-bold-duotone"
            color="success"
            trend={{ value: 8.2, label: 'than last month' }}
            chart={{
              data: [2200, 3800, 2500, 5100, 4200, 6300, 5800, 7200, 6500, 7800, 8100, 8900],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={1423}
            label="New Orders"
            icon="solar:bag-4-bold-duotone"
            color="info"
            trend={{ value: -3.5, label: 'than last month' }}
            chart={{
              data: [140, 120, 160, 130, 145, 155, 164, 152, 139, 136, 130, 125],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            value={98.5}
            label="Conversion Rate"
            icon="solar:chart-square-bold-duotone"
            color="warning"
            trend={{ value: 1.2, label: 'than last month' }}
            formatValue={(val) => `${typeof val === 'number' ? val : 0}%`}
            chart={{
              data: [95, 96, 94, 97, 96, 98, 97, 98, 99, 98, 97, 98.5],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            }}
          />
        </Grid>
      </Grid>
    </Box>
  ),
};
// ----------------------------------------------------------------------
// Border Visibility
// ----------------------------------------------------------------------

export const BorderVisible: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid xs={12} sm={6}>
        <StatCard
          value={18765}
          label="With Border (Default)"
          icon="solar:users-group-rounded-bold-duotone"
          color="primary"
          borderVisible={true}
          trend={{ value: 2.6, label: 'than last week' }}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <StatCard
          value={18765}
          label="Without Border"
          icon="solar:users-group-rounded-bold-duotone"
          color="primary"
          borderVisible={false}
          trend={{ value: 2.6, label: 'than last week' }}
        />
      </Grid>
    </Grid>
  ),
};
