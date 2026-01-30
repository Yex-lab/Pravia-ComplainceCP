'use client';

import { Box, TextField, InputAdornment, Select, MenuItem, FormControl, Skeleton } from '@mui/material';

import { Iconify } from '../../iconify';
import type { SearchConfig, DataTableSearchProps } from '../types';

export function DataTableSearch<T>({
  searchConfig,
  searchQuery,
  filters,
  onSearchChange,
  onFilterChange,
  labels = {},
  isLoading,
}: DataTableSearchProps<T>) {
  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[filterKey] = [value];
    } else {
      delete newFilters[filterKey];
    }
    onFilterChange(filterKey as any, value ? [value] : []);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      {isLoading ? (
        <Skeleton variant="rounded" width={240} height={40} sx={{ borderRadius: 1 }} />
      ) : (
        <TextField
          placeholder={searchConfig.placeholder || labels?.search || 'Search...'}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 240 }}
        />
      )}
      
      {searchConfig.filterOptions?.map((filterOption) => (
        <FormControl key={filterOption.value} sx={{ minWidth: 120 }} size="small">
          {isLoading ? (
            <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: 1 }} />
          ) : (
            <Select
              value={filters[filterOption.value]?.[0] || filterOption.options[0] || ''}
              onChange={(e) => handleFilterChange(filterOption.value, e.target.value)}
              displayEmpty
            >
              {filterOption.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
      ))}
    </Box>
  );
}
