import { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Box, Divider, Stack, Skeleton, Link, Chip, IconButton, Popover, MenuList, MenuItem } from '@mui/material';
import { Iconify } from '../iconify';
import { Label } from '../label';

// Date formatting function
const formatDate = (dateString: string, format: string = 'MM/DD/YYYY'): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return format
    .replace('MM', month)
    .replace('DD', day)
    .replace('YYYY', String(year))
    .replace('YY', String(year).slice(-2));
};

interface FieldRowItemProps {
  label: string;
  value: string;
  icon?: string;
  fieldIconSize?: number;
  fieldIconOpacity?: number;
  sx?: any;
  loading?: boolean;
  type?: 'field' | 'divider' | 'label' | 'date' | 'email' | 'hidden';
  labelConfig?: {
    color?: 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'default';
    variant?: 'filled' | 'soft' | 'outlined';
  };
  dateConfig?: {
    format?: string;
  };
  hiddenConfig?: {
    buttonLabel?: string;
    icon?: string;
  };
  renderValue?: () => React.ReactNode;
}

const FieldRowItem = ({
  label,
  value,
  icon,
  fieldIconSize = 16,
  fieldIconOpacity = 0.5,
  sx,
  loading = false,
  type = 'field',
  labelConfig,
  dateConfig,
  hiddenConfig,
  renderValue,
}: FieldRowItemProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <Stack direction="row" alignItems="flex-start" spacing={1} sx={sx}>
      {icon && (
        loading ? (
          <Skeleton variant="circular" width={fieldIconSize} height={fieldIconSize} sx={{ mt: 0.25 }} />
        ) : (
          <Iconify
            icon={icon as any}
            height={fieldIconSize}
            sx={{
              color: 'text.secondary',
              opacity: fieldIconOpacity,
              mt: 0.25,
            }}
          />
        )
      )}
      <Stack spacing={0.5} sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {loading ? <Skeleton variant="text" width={80} /> : label}
        </Typography>
        {(() => {
          if (loading) {
            return <Skeleton variant="text" width={120} />;
          }
          if (renderValue) {
            return renderValue();
          }
          if (type === 'hidden') {
            return (
              <Box sx={{ alignSelf: 'flex-start' }}>
                {isRevealed ? (
                  <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                    {value}
                  </Typography>
                ) : (
                  <Chip
                    label={hiddenConfig?.buttonLabel || 'Show'}
                    size="small"
                    icon={hiddenConfig?.icon ? <Iconify icon={hiddenConfig.icon as any} width={16} /> : undefined}
                    onClick={() => setIsRevealed(true)}
                    sx={{ cursor: 'pointer' }}
                  />
                )}
              </Box>
            );
          }
          if (type === 'label') {
            return (
              <Box sx={{ alignSelf: 'flex-start' }}>
                <Label 
                  color={labelConfig?.color || 'success'} 
                  variant={labelConfig?.variant || 'outlined'}
                >
                  {value}
                </Label>
              </Box>
            );
          }
          if (type === 'date') {
            return (
              <Typography variant="body2" fontWeight={500}>
                {formatDate(value, dateConfig?.format)}
              </Typography>
            );
          }
          if (type === 'email') {
            return (
              <Link 
                href={`mailto:${value}`} 
                variant="body2" 
                sx={{ fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                {value}
              </Link>
            );
          }
          return (
            <Typography variant="body2" fontWeight={500}>
              {value}
            </Typography>
          );
        })()}
      </Stack>
    </Stack>
  );
};

// ----------------------------------------------------------------------

export type LabelColor = 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'default';
export type LabelVariant = 'filled' | 'soft' | 'outlined';

export interface LabelConfig {
  color?: LabelColor;
  variant?: LabelVariant;
}

export interface ActionConfig {
  type: 'menu' | 'button';
  icon?: string;
  onClick?: () => void;
  items?: Array<{
    label: string;
    icon?: string;
    onClick: () => void;
  }>;
}

// ----------------------------------------------------------------------

export interface CustomCardConfig {
  title: string;
  icon: string;
  subtitle?: string;
  divider?: boolean;
  status?: {
    label: string;
    color: 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'default';
    variant?: 'filled' | 'soft' | 'outlined';
  };
  action?: React.ReactNode;
  actionConfig?: ActionConfig;
  data: Array<{
    label?: string;
    value?: string;
    fullWidth?: boolean;
    icon?: string;
    type?: 'field' | 'divider' | 'label' | 'date' | 'email' | 'hidden';
    dividerStyle?: 'solid' | 'dashed' | 'dotted';
    labelConfig?: LabelConfig;
    labelConfigIfNull?: LabelConfig;
    valueIfNull?: string;
    dateConfig?: {
      format?: string;
    };
    hiddenConfig?: {
      buttonLabel?: string;
      icon?: string;
    };
    renderValue?: () => React.ReactNode;
  }>;
  layout?: {
    columns?: number;
    maxWidth?: number | string;
  };
  styling?: {
    iconColor?: string;
    fieldIconSize?: number;
    fieldIconOpacity?: number;
  };
}

interface CustomCardProps {
  config: CustomCardConfig;
  loading?: boolean;
}

export function CustomCard({ config, loading = false }: CustomCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const {
    title,
    icon,
    subtitle,
    divider = true,
    status,
    action,
    actionConfig,
    data,
    layout = {},
    styling = {}
  } = config;

  const {
    columns = 2,
    maxWidth = 600
  } = layout;

  const {
    iconColor = 'primary.main',
    fieldIconSize = 16,
    fieldIconOpacity = 0.5
  } = styling;
  const columnWidth = 12 / columns;

  const renderAction = () => {
    if (action) return action;
    if (status) return <Label color={status.color} variant={status.variant || 'soft'}>{status.label}</Label>;
    if (actionConfig?.type === 'button') {
      return (
        <IconButton onClick={actionConfig.onClick}>
          <Iconify icon={(actionConfig.icon || 'eva:edit-fill') as any} />
        </IconButton>
      );
    }
    if (actionConfig?.type === 'menu') {
      return (
        <>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <Iconify icon={(actionConfig.icon || 'eva:more-vertical-fill') as any} />
          </IconButton>
          <Popover
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuList>
              {actionConfig.items?.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    setMenuAnchor(null);
                    item.onClick();
                  }}
                >
                  {item.icon && <Iconify icon={item.icon as any} sx={{ mr: 1 }} />}
                  {item.label}
                </MenuItem>
              ))}
            </MenuList>
          </Popover>
        </>
      );
    }
    return null;
  };

  // Group data into rows based on columns, except for fullWidth items and dividers
  const rows: Array<
    Array<{
      label?: string;
      value?: string;
      fullWidth?: boolean;
      icon?: string;
      type?: 'field' | 'divider' | 'label' | 'date' | 'email' | 'hidden';
      dividerStyle?: 'solid' | 'dashed' | 'dotted';
      labelConfig?: {
        color?: 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'default';
        variant?: 'filled' | 'soft' | 'outlined';
      };
      dateConfig?: {
        format?: string;
      };
      hiddenConfig?: {
        buttonLabel?: string;
        icon?: string;
      };
    }>
  > = [];
  let currentRow: Array<{
    label?: string;
    value?: string;
    fullWidth?: boolean;
    icon?: string;
    type?: 'field' | 'divider' | 'label' | 'date' | 'email' | 'hidden';
    dividerStyle?: 'solid' | 'dashed' | 'dotted';
    labelConfig?: {
      color?: 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'default';
      variant?: 'filled' | 'soft' | 'outlined';
    };
    dateConfig?: {
      format?: string;
    };
    hiddenConfig?: {
      buttonLabel?: string;
      icon?: string;
    };
  }> = [];

  data.forEach((item) => {
    if (item.type === 'divider' || item.fullWidth) {
      // If current row has items, push it and start new row
      if (currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
      }
      // Add divider or fullWidth item as its own row
      rows.push([item]);
    } else {
      currentRow.push(item);
      // If row is full, push it and start new row
      if (currentRow.length === columns) {
        rows.push(currentRow);
        currentRow = [];
      }
    }
  });

  // Push any remaining items
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return (
    <Card sx={{ maxWidth }}>
      <CardHeader
        avatar={
          loading ? (
            <Skeleton variant="circular" width={32} height={32} />
          ) : (
            <Iconify icon={icon as any} sx={{ color: iconColor }} width={32} />
          )
        }
        action={loading ? null : renderAction()}
        title={loading ? <Skeleton variant="text" width={150} /> : title}
        subheader={subtitle && (loading ? <Skeleton variant="text" width={200} /> : subtitle)}
        sx={{
          px: 2,
          pt: '10px',
          pb: divider ? 1.5 : 2,
          '& .MuiCardHeader-title': {
            fontSize: '1.125rem',
            fontWeight: 600,
          },
          '& .MuiCardHeader-subheader': {
            marginTop: '0.125rem',
          },
        }}
      />

      {divider && <Divider />}

      <CardContent sx={{ pt: divider ? 1.5 : 2 }}>

        <Stack spacing={2}>
          {rows.map((row, rowIndex) => (
            <Box key={rowIndex}>
              {row[0]?.type === 'divider' ? (
                loading ? (
                  <Skeleton variant="rectangular" width="100%" height={1} />
                ) : (
                  <Divider sx={{ borderStyle: row[0]?.dividerStyle || 'solid' }} />
                )
              ) : (
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  {row.map((item, itemIndex) => (
                    <FieldRowItem
                      key={itemIndex}
                      label={item.label!}
                      value={item.value!}
                      icon={item.icon}
                      type={item.type}
                      labelConfig={item.labelConfig}
                      dateConfig={item.dateConfig}
                      hiddenConfig={item.hiddenConfig}
                      renderValue={(item as any).renderValue}
                      fieldIconSize={fieldIconSize}
                      fieldIconOpacity={fieldIconOpacity}
                      loading={loading}
                      sx={{
                        flex: item.fullWidth
                          ? '1 1 100%'
                          : `1 1 ${100 / Math.min(row.length, columns)}%`,
                        minWidth: 0,
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
