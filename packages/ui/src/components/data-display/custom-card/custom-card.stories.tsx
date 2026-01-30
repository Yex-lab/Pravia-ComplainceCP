import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomCard } from './custom-card';

const meta: Meta<typeof CustomCard> = {
  title: 'Data Display/Custom Card',
  component: CustomCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OrganizationInformation: Story = {
  args: {
    config: {
      title: 'Data Display/Custom Card',
      icon: 'mdi:office-building',
      status: {
        label: 'Approved',
        color: 'success',
        variant: 'soft'
      },
      data: [
        { label: 'Legal Name', value: 'CloudCORO Inc' },
        { label: 'Tax ID / EIN', value: '45-566345' },
        { label: 'Organization Type', value: 'Corporation' },
        { label: 'Registration Date', value: '10/17/2025' },
      ],
    }
  },
};

export const SkeletonLoading: Story = {
  args: {
    config: {
      title: 'Data Display/Custom Card',
      icon: 'mdi:office-building',
      status: {
        label: 'Approved',
        color: 'success',
        variant: 'soft'
      },
      data: [
        { label: 'Legal Name', value: 'CloudCORO Inc' },
        { label: 'Tax ID / EIN', value: '45-566345' },
        { label: 'Organization Type', value: 'Corporation' },
        { label: 'Registration Date', value: '10/17/2025' },
      ],
    },
    loading: true,
  },
};

export const BusinessAddress: Story = {
  args: {
    config: {
      title: 'Data Display/Custom Card',
      icon: 'mdi:map-marker',
      data: [
        { label: 'Street Address', value: '975 Reserve DR', icon: 'mdi:road' },
        { label: 'City', value: 'Roseville', icon: 'mdi:city' },
        { label: 'State', value: 'CA', icon: 'mdi:map' },
        { label: 'ZIP Code', value: '95678', icon: 'mdi:mailbox' },
        { 
          label: 'Full Address', 
          value: '975 Reserve DR, Roseville, CA 95678',
          fullWidth: true,
          icon: 'mdi:map-marker-outline'
        },
      ],
    }
  },
};

export const ContactInformation: Story = {
  args: {
    config: {
      title: 'Data Display/Custom Card',
      icon: 'mdi:email',
      data: [
        { label: 'Primary Email', value: 'info@cloudcoro.com', icon: 'mdi:email-outline' },
        { label: 'Primary Phone', value: '9169876543', icon: 'mdi:phone' },
      ],
    }
  },
};

export const ThreeColumns: Story = {
  args: {
    config: {
      title: 'Data Display/Custom Card',
      icon: 'mdi:view-column',
      layout: {
        columns: 3
      },
      data: [
        { label: 'Field 1', value: 'Value 1' },
        { label: 'Field 2', value: 'Value 2' },
        { label: 'Field 3', value: 'Value 3' },
        { label: 'Field 4', value: 'Value 4' },
        { label: 'Field 5', value: 'Value 5' },
        { label: 'Field 6', value: 'Value 6' },
      ],
    }
  },
};

export const SingleColumn: Story = {
  args: {
    config: {
      title: 'Data Display/Custom Card',
      icon: 'mdi:view-agenda',
      layout: {
        columns: 1,
        maxWidth: 400
      },
      data: [
        { label: 'Description', value: 'This is a single column layout that stacks all items vertically' },
        { label: 'Use Case', value: 'Perfect for narrow spaces or mobile views' },
        { label: 'Benefits', value: 'Easy to read and scan' },
      ],
    }
  },
};

export const WithDividers: Story = {
  args: {
    config: {
      title: 'Data Display/Custom Card',
      icon: 'mdi:view-split-horizontal',
      data: [
        { label: 'Section 1 Field 1', value: 'Value 1' },
        { label: 'Section 1 Field 2', value: 'Value 2' },
        { type: 'divider' },
        { label: 'Section 2 Field 1', value: 'Value 3' },
        { label: 'Section 2 Field 2', value: 'Value 4' },
        { type: 'divider' },
        { label: 'Final Section', value: 'Final Value', fullWidth: true },
      ],
    }
  },
};

export const WithLabelFields: Story = {
  args: {
    config: {
      title: 'Data Display/Custom Card',
      icon: 'mdi:office-building',
      status: {
        label: 'Active',
        color: 'success',
        variant: 'soft'
      },
      data: [
        { label: 'Name', value: 'California Department of Technology' },
        { label: 'Type', value: 'State Agency' },
        { label: 'Parent Organization', value: 'State of California' },
        { label: 'Acronym', value: 'CDT' },
        { 
          label: 'Org Code', 
          value: 'ORG-CA-001', 
          type: 'label',
          labelConfig: { color: 'success', variant: 'outlined' }
        },
        { 
          label: 'Gov Code', 
          value: 'GOV-STATE-CA', 
          type: 'label',
          labelConfig: { color: 'success', variant: 'outlined' }
        },
        { label: 'SOC Email', value: 'soc@cdt.ca.gov' },
        { 
          label: 'Status', 
          value: 'Compliant', 
          type: 'label',
          labelConfig: { color: 'primary', variant: 'soft' }
        },
      ],
    }
  },
};

export const TitleTruncation: Story = {
  args: {
    config: {
      title: 'Data Display/Custom Card',
      icon: 'mdi:office-building',
      status: {
        label: 'Approved',
        color: 'success',
        variant: 'soft'
      },
      data: [
        { label: 'Name', value: 'Test Corp' },
        { label: 'ID', value: '12345' },
      ],
      layout: {
        maxWidth: 250
      }
    }
  },
};
