import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

type DataTableSkeletonProps = {
  columns: number;
  rows?: number;
  enableSelection?: boolean;
  dense?: boolean;
};

export function DataTableSkeleton({
  columns,
  rows = 5,
  enableSelection = true,
  dense = false,
}: DataTableSkeletonProps) {
  const rowHeight = dense ? 52 : 72;

  return (
    <>
      {/* Header Skeleton */}
      <TableHead
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'),
        }}
      >
        <TableRow>
          {enableSelection && (
            <TableCell padding="checkbox">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  backgroundColor: 'transparent',
                  outline: 0,
                  border: 0,
                  margin: 0,
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  textDecoration: 'none',
                  padding: '9px',
                  borderRadius: '50%',
                }}
              >
                <Skeleton variant="rectangular" width={18} height={18} />
              </span>
            </TableCell>
          )}
          {Array.from({ length: columns }).map((_, index) => (
            <TableCell key={index}>
              <Skeleton variant="text" width="80%" height={24} />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      {/* Body Skeleton */}
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} sx={{ height: rowHeight }}>
            {enableSelection && (
              <TableCell padding="checkbox">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxSizing: 'border-box',
                    backgroundColor: 'transparent',
                    outline: 0,
                    border: 0,
                    margin: 0,
                    cursor: 'pointer',
                    userSelect: 'none',
                    verticalAlign: 'middle',
                    appearance: 'none',
                    textDecoration: 'none',
                    padding: '9px',
                    borderRadius: '50%',
                  }}
                >
                  <Skeleton variant="rectangular" width={18} height={18} />
                </span>
              </TableCell>
            )}
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton variant="text" width={`${60 + Math.random() * 30}%`} height={20} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}
