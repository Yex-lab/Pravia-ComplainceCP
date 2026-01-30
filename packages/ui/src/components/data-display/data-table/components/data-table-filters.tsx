'use client';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';

import { Iconify } from '../../iconify';
import { Label } from '../../label';
import type { FilterTab, DataTableFiltersProps } from '../types';

export function DataTableFilters<T>({
  filterTabs,
  activeTab,
  sortedDataLength,
  labels,
  getTabCount,
  onTabChange,
  isLoading,
  onRefresh,
  refreshTooltip = 'Refresh',
}: DataTableFiltersProps<T>) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}`,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        sx={{
          px: { md: 2.5 },
          minHeight: 54,
          '& .MuiTab-root': {
            minHeight: 54,
            py: 0.5,
            transition: 'color 0.2s ease',
            textTransform: 'none',
            color: (theme) => theme.vars?.palette.text.secondary,
            '&:hover': {
              backgroundColor: 'transparent',
              color: (theme) => theme.vars?.palette.text.primary,
            },
            '&.Mui-selected': {
              backgroundColor: 'transparent',
              color: (theme) => theme.vars?.palette.text.primary,
            },
          },
        }}
      >
        {filterTabs.map((tab) => (
          <Tab
            key={tab.id}
            iconPosition="end"
            value={tab.id}
            label={tab.label}
            icon={
              isLoading ? (
                <Skeleton variant="rounded" width={32} height={22} sx={{ borderRadius: 1 }} />
              ) : (
                <Label
                  variant={tab.id === activeTab ? 'filled' : 'soft'} 
                  color={tab.color || 'default'}
                >
                  {getTabCount(tab)}
                </Label>
              )
            }
          />
        ))}
      </Tabs>

      {isLoading ? (
        <Skeleton variant="rounded" width={160} height={32} sx={{ borderRadius: 2 }} />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<Iconify icon="solar:document-text-bold-duotone" width={18} />}
            label={`${labels?.resultsFound || 'Results Found'} ${sortedDataLength}`}
            sx={{
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              fontWeight: 500,
            }}
          />
          
          {onRefresh && (
            <Tooltip title={refreshTooltip}>
              <IconButton
                onClick={onRefresh}
                size="small"
              >
                <Iconify icon="solar:restart-bold" width={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
}
