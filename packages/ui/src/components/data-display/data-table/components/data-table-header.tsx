'use client';

import { forwardRef } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import type { Column, DataTableHeaderProps } from '../types';
import TableSortLabel from '@mui/material/TableSortLabel';



export const DataTableHeader = forwardRef<HTMLTableSectionElement, DataTableHeaderProps<any>>(function DataTableHeader({
  columns,
  enableSelection,
  selected,
  paginatedData,
  dense,
  orderBy,
  order,
  onSelectAll,
  onSort,
}: DataTableHeaderProps<any>, ref: React.Ref<HTMLTableSectionElement>) {
  return (
    <TableHead
      ref={ref}
      sx={{
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
        position: 'relative'
      }}
    >
      <TableRow>
        {enableSelection && (
          <TableCell padding="checkbox">
            <Checkbox
              size="small"
              indeterminate={selected.length > 0 && selected.length < paginatedData.length}
              checked={paginatedData.length > 0 && selected.length === paginatedData.length}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            key={String(column.id)}
            sx={{
              width: column.width,
              minWidth: column.minWidth,
              maxWidth: column.maxWidth,
            }}
          >
            {column.sortable ? (
              <Tooltip title={column.label} placement="top">
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={() => onSort(column.id)}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}
                >
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            ) : (
              <Tooltip title={column.label} placement="top">
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}
                >
                  {column.label}
                </span>
              </Tooltip>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
});
