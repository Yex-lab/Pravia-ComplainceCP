import type { FluxTypes } from '@asyml8/api-types';

import { useState, useEffect } from 'react';
import { ICONS, Iconify } from '@asyml8/ui';

import {
  Box,
  Card,
  Chip,
  Menu,
  Stack,
  Tooltip,
  Collapse,
  MenuItem,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

import { IconWithBackground } from 'src/components/icon-with-background';

type Submission = FluxTypes.SubmissionDto;
type Designee = FluxTypes.DesigneeDto;

interface ComplianceCardProps {
  type: 'submission' | 'designee';
  data: Submission | Designee;
  icon: any;
  iconColor?: 'primary.main' | 'secondary.main';
  title: string;
  subtitle: string;
  expanded?: boolean;
  statusChip?: {
    label: string;
    color: 'info' | 'default' | 'warning' | 'error' | 'success';
  };
  rows?: Array<{
    icon: any;
    label: string;
    value: string;
  }>;
  actions?: Array<{
    icon: any;
    title: string;
    onClick: () => void;
    color?: 'error';
  }>;
}

export function ComplianceCard({
  type,
  icon,
  iconColor = 'primary.main',
  title,
  subtitle,
  expanded: controlledExpanded,
  statusChip,
  rows = [],
  actions = [],
}: ComplianceCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Sync internal state when controlled state changes
  useEffect(() => {
    if (controlledExpanded !== undefined) {
      setInternalExpanded(controlledExpanded);
    }
  }, [controlledExpanded]);

  const isExpanded = internalExpanded;

  const handleToggle = () => {
    setInternalExpanded(!internalExpanded);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: () => void) => {
    action();
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 1.5,
        pt: 2,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Status chip moved to inline row below - keeping this for reference
      {statusChip && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Chip
            label={statusChip.label}
            color={statusChip.color}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              '& .MuiChip-label': {
                fontWeight: 800,
                px: 1.25,
                py: 0.125,
              },
            }}
          />
          {actions.length > 0 && (
            <IconButton 
              size="small" 
              onClick={handleMenuOpen}
            >
              <Iconify icon={ICONS.MORE_VERTICAL} />
            </IconButton>
          )}
        </Box>
      )}
      */}
      <CardContent sx={{ flex: 1, p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
              flexShrink: 0,
            }}
          >
            <Iconify icon={icon} width={40} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {title}
            </Typography>
            <Tooltip title={subtitle} placement="top" arrow>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word',
                  cursor: 'help',
                }}
              >
                {subtitle}
              </Typography>
            </Tooltip>
          </Box>
          {type === 'designee' && rows.length > 0 && (
            <IconButton size="small" onClick={handleToggle} sx={{ flexShrink: 0 }}>
              <Iconify icon={isExpanded ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN} width={20} />
            </IconButton>
          )}
          {type === 'submission' && actions.length > 0 && (
            <IconButton size="small" onClick={handleMenuOpen} sx={{ flexShrink: 0 }}>
              <Iconify icon={ICONS.MORE_VERTICAL} />
            </IconButton>
          )}
        </Box>

        {type === 'submission' && rows.length > 0 && (
          <Stack spacing={1}>
            {/* Status row */}
            {statusChip && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ ml: '8px' }}>
                  <IconWithBackground icon={ICONS.INFO_CIRCLE} color="text.secondary" />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: '8px', minWidth: '80px', fontWeight: 600 }}
                >
                  Status:
                </Typography>
                <Chip
                  label={statusChip.label}
                  color={statusChip.color}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    height: 20,
                    '& .MuiChip-label': {
                      fontWeight: 800,
                      px: 1,
                      py: 0,
                    },
                  }}
                />
              </Box>
            )}
            {/* Other rows */}
            {rows.map((row, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ ml: '8px' }}>
                  <IconWithBackground icon={row.icon} color="text.secondary" />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: '8px', minWidth: '80px', fontWeight: 600 }}
                >
                  {row.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}

        {type === 'designee' && rows.length > 0 && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Stack spacing={1}>
              {rows.map((row, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ ml: '8px' }}>
                    <IconWithBackground icon={row.icon} color="text.secondary" />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: '12px' }}>
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Collapse>
        )}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => handleActionClick(action.onClick)}
            sx={{ color: action.color === 'error' ? 'error.main' : 'inherit' }}
          >
            <Iconify icon={action.icon} width={20} sx={{ mr: 1 }} />
            {action.title}
          </MenuItem>
        ))}
      </Menu>

      {/* Bottom actions - commented out in favor of three-dot menu
      {actions.length > 0 && (
        <>
          <Box sx={{ mt: 2, mx: -1.5 }}>
            <Divider />
          </Box>

          <CardActions sx={{ justifyContent: 'flex-end', pt: 1, px: 0, pb: 0 }}>
            <Box>
              {actions.map((action, index) => (
                <IconButton
                  key={index}
                  size="small"
                  onClick={action.onClick}
                  title={action.title}
                  color={action.color}
                >
                  <Iconify icon={action.icon} />
                </IconButton>
              ))}
            </Box>
          </CardActions>
        </>
      )}
      */}
    </Card>
  );
}
