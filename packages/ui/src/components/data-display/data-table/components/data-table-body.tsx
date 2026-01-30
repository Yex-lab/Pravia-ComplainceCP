'use client';

import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import type { Column, DataTableBodyProps } from '../types';

export function DataTableBody<T>({
  columns,
  displayData,
  isLoading,
  enableSelection,
  selected,
  dense,
  maxRowHeight,
  emptyMessage,
  getRowId,
  onRowClick,
  onSelectOne,
}: DataTableBodyProps<T>) {
  return (
    <TableBody>
      {displayData.length === 0 ? (
        <TableRow>
          <TableCell colSpan={columns.length + (enableSelection ? 1 : 0)} align="center" sx={{ py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          </TableCell>
        </TableRow>
      ) : (
        displayData.map((row) => {
          const id = getRowId(row);
          const isSelected = selected.includes(id);
          return (
            <TableRow 
              key={id}
              hover
              selected={isSelected}
              onClick={() => onRowClick?.(row)}
              sx={{
                height: dense ? 56 : 76,
                cursor: onRowClick ? 'pointer' : 'default',
                ...(isSelected && {
                  bgcolor: 'action.hover',
                }),
              }}
            >
              {enableSelection && (
                <TableCell 
                  padding="checkbox"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectOne(id);
                    }}
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
                  {column.render 
                    ? (column.render(row[column.id], row) as React.ReactNode)
                    : String(row[column.id] ?? '')
                  }
                </TableCell>
              ))}
            </TableRow>
          );
        })
      )}
    </TableBody>
  );
}
