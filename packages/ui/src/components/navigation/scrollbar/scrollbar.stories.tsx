import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Typography, Card } from '@mui/material';
import { Scrollbar } from './scrollbar';

const meta: Meta<typeof Scrollbar> = {
  title: 'Navigation/Scrollbar',
  component: Scrollbar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Scrollbar>;

// Content generators
const generateVerticalContent = (items: number) => (
  <Box sx={{ p: 2 }}>
    {Array.from({ length: items }, (_, i) => (
      <Typography key={i} sx={{ mb: 1 }}>
        Item {i + 1} - This is some content that creates vertical overflow when there are many items.
      </Typography>
    ))}
  </Box>
);

const generateHorizontalContent = () => (
  <Box sx={{ display: 'flex', gap: 2, p: 2, minWidth: 1200 }}>
    {Array.from({ length: 10 }, (_, i) => (
      <Card key={i} sx={{ minWidth: 200, p: 2, flexShrink: 0 }}>
        <Typography variant="h6">Card {i + 1}</Typography>
        <Typography variant="body2">
          This card has a fixed width to create horizontal overflow.
        </Typography>
      </Card>
    ))}
  </Box>
);

export const VerticalScroll: Story = {
  render: () => (
    <Box sx={{ height: 300, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Scrollbar>
        {generateVerticalContent(50)}
      </Scrollbar>
    </Box>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <Box sx={{ width: 600, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Scrollbar fillContent={false}>
        {generateHorizontalContent()}
      </Scrollbar>
    </Box>
  ),
};

export const BothDirections: Story = {
  render: () => (
    <Box sx={{ width: 400, height: 300, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Scrollbar fillContent={false}>
        <Box sx={{ minWidth: 800, p: 2 }}>
          {Array.from({ length: 30 }, (_, i) => (
            <Typography key={i} sx={{ mb: 1, whiteSpace: 'nowrap' }}>
              Item {i + 1} - This is a very long line of text that will cause horizontal overflow and there are many items for vertical overflow too.
            </Typography>
          ))}
        </Box>
      </Scrollbar>
    </Box>
  ),
};

export const WithCustomStyling: Story = {
  render: () => (
    <Box sx={{ height: 250, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Scrollbar
        sx={{
          '& .simplebar-content': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {generateVerticalContent(30)}
      </Scrollbar>
    </Box>
  ),
};

export const TableLikeScroll: Story = {
  render: () => (
    <Box sx={{ width: 500, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Scrollbar fillContent={false}>
        <Box sx={{ minWidth: 800, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Table-like Content
          </Typography>
          {Array.from({ length: 10 }, (_, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1, minWidth: 700 }}>
              <Box sx={{ width: 100, fontWeight: 'bold' }}>Name {i + 1}</Box>
              <Box sx={{ width: 200 }}>email{i + 1}@example.com</Box>
              <Box sx={{ width: 150 }}>Role {i + 1}</Box>
              <Box sx={{ width: 100 }}>Active</Box>
              <Box sx={{ width: 100 }}>Actions</Box>
            </Box>
          ))}
        </Box>
      </Scrollbar>
    </Box>
  ),
};
