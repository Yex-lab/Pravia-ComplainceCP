'use client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

import type {
  SearchConfig,
  ActionConfig,
  DataTableToolbarProps,
} from '../types';
import { Iconify } from '../../iconify';

export function DataTableToolbar<T>({
  searchConfig,
  searchQuery,
  filters,
  canReset,
  actions,
  actionsComponent,
  selectedIds,
  labels,
  onSearchChange,
  onFilterChange,
  onActionsClick,
  onClearAll,
  isLoading,
}: DataTableToolbarProps<T>) {
  return (
    <Box sx={{ p: 2.5, pb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        {searchConfig?.filterOptions?.map((filterOption) => (
          <FormControl key={filterOption.value} sx={{ minWidth: 120 }}>
            {isLoading ? (
              <Skeleton variant="rounded" width={120} height={56} sx={{ borderRadius: 1 }} />
            ) : (
              <>
                <InputLabel>{filterOption.label}</InputLabel>
                <Select
                  multiple
                  label={filterOption.label}
                  value={filters[filterOption.value] || []}
                  onChange={(e) =>
                    onFilterChange(filterOption.value, e.target.value as string[])
                  }
                  renderValue={(selected) => selected.join(', ')}
                >
                  {filterOption.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox
                        size="small"
                        checked={(filters[filterOption.value] || []).includes(
                          option
                        )}
                      />
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </FormControl>
        ))}

        {isLoading ? (
          <Skeleton variant="rounded" sx={{ flexGrow: 1, height: 56, borderRadius: 1 }} />
        ) : (
          <TextField
            sx={{ flexGrow: 1 }}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              labels?.search || searchConfig?.placeholder || 'Search...'
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
            }}
          />
        )}

        {actionsComponent || (
          <>
            {actions && actions.length > 0 && (
              <IconButton onClick={onActionsClick}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            )}
          </>
        )}
      </Box>

      {canReset && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {Object.entries(filters).map(([key, values]) => {
            const filterOption = searchConfig?.filterOptions?.find(
              (f) => f.value === key
            );
            if (values.length === 0) return null;

            return (
              <Box
                key={key}
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                  gap: 1,
                  p: 1,
                  borderRadius: 1,
                  border: (theme) => `dashed 1px ${theme.palette.divider}`,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    height: 24,
                    lineHeight: '24px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {filterOption?.label || key}:
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {values.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      onDelete={() => {
                        const newValues = filters[key].filter(
                          (v) => v !== value
                        );
                        onFilterChange(key, newValues);
                      }}
                      size="small"
                      sx={{
                        bgcolor: 'action.selected',
                        color: (theme) => theme.vars?.palette.text.primary || 'text.primary',
                        '& .MuiChip-deleteIcon': {
                          fontSize: '1rem',
                          color: (theme) => theme.vars?.palette.text.secondary || 'text.secondary',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            );
          })}

          {searchQuery && (
            <Box
              sx={{
                display: 'flex',
                overflow: 'hidden',
                gap: 1,
                p: 1,
                borderRadius: 1,
                border: (theme) => `dashed 1px ${theme.palette.divider}`,
              }}
            >
              <Box
                component="span"
                sx={{
                  height: 24,
                  lineHeight: '24px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                Keyword:
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label={searchQuery}
                  onDelete={() => onSearchChange('')}
                  size="small"
                  sx={{
                    bgcolor: 'action.selected',
                    color: (theme) => theme.vars?.palette.text.primary || 'text.primary',
                    '& .MuiChip-deleteIcon': {
                      fontSize: '1rem',
                      color: (theme) => theme.vars?.palette.text.secondary || 'text.secondary',
                    },
                  }}
                />
              </Box>
            </Box>
          )}

          <Button
            size="small"
            color="error"
            onClick={onClearAll}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            {labels?.clear || 'Clear'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
