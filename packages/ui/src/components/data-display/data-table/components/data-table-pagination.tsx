'use client';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import type { DataTablePaginationProps } from '../types';
import { Iconify } from '../../iconify';


export function DataTablePagination({
  enableDense,
  dense,
  rowsPerPage,
  page,
  sortedDataLength,
  labels,
  rowsPerPageOptions = [5, 10, 25],
  maxPages,
  onDenseChange,
  onRowsPerPageChange,
  onPageChange,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(sortedDataLength / rowsPerPage);
  const effectiveMaxPages = maxPages ? Math.min(totalPages, maxPages) : totalPages;
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, sortedDataLength);
  const effectiveEndItem = maxPages ? Math.min(endItem, maxPages * rowsPerPage) : endItem;
  const effectiveTotal = maxPages ? Math.min(sortedDataLength, maxPages * rowsPerPage) : sortedDataLength;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1, pb: 2.5 }}>
      {enableDense && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Switch
            checked={dense}
            onChange={(e) => onDenseChange(e.target.checked)}
            size="medium"
          />
          <Typography variant="body2">{labels?.dense || 'Dense'}</Typography>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {labels?.rowsPerPage || 'Rows per page'}:
        </Typography>
        <Select
          value={rowsPerPage}
          onChange={(e) => {
            onRowsPerPageChange(Number(e.target.value));
            onPageChange(0);
          }}
          size="small"
          sx={{ minWidth: 60 }}
        >
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {startItem}–{effectiveEndItem} of {effectiveTotal}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>
          <IconButton
            size="small"
            disabled={page >= effectiveMaxPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            <Iconify icon="eva:arrow-ios-forward-fill" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
