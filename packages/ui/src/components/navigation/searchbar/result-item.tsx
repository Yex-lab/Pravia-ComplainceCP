import type { ListItemButtonProps } from '@mui/material/ListItemButton';

import { Label } from '@asyml8/ui';
import { varAlpha, isExternalLink } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

// ----------------------------------------------------------------------

type Props = Omit<ListItemButtonProps, 'title'> & {
  href: string;
  labels: string[];
  title: { text: string; highlight: boolean }[];
  path: { text: string; highlight: boolean }[];
  onNavigate?: (path: string) => void;
};

export function ResultItem({ title, path, labels, href, onNavigate, sx, ...other }: Props) {
  const isExternal = isExternalLink(href);
  
  const handleClick = (event: React.MouseEvent) => {
    console.log('ResultItem clicked:', { href, isExternal, hasOnNavigate: !!onNavigate });
    
    if (!isExternal && onNavigate) {
      console.log('Calling onNavigate with:', href);
      onNavigate(href);
    }
    // Call the original onClick if provided (handleClose from searchbar)
    if (other.onClick) {
      console.log('Calling original onClick');
      other.onClick(event as any);
    }
  };
  
  const linkProps = isExternal
    ? { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' }
    : { 
        onClick: handleClick,
      };

  return (
    <ListItemButton
      {...other}
      {...linkProps}
      disableRipple
      sx={[
        (theme) => ({
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: 'transparent',
          borderBottomColor: theme.vars.palette.divider,
          '&:hover': {
            borderRadius: 1,
            borderColor: theme.vars.palette.primary.main,
            backgroundColor: varAlpha(
              theme.vars.palette.primary.mainChannel,
              theme.vars.palette.action.hoverOpacity
            ),
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <ListItemText
        primary={title.map((part, index) => (
          <Box
            key={index}
            component="span"
            sx={{
              ...(part.highlight && {
                color: 'primary.main',
              }),
            }}
          >
            {part.text}
          </Box>
        ))}
        secondary={path.map((part, index) => (
          <Box
            key={index}
            component="span"
            sx={{
              color: 'text.secondary',
              ...(part.highlight && {
                color: 'primary.main',
                fontWeight: 'fontWeightBold',
              }),
            }}
          >
            {part.text}
          </Box>
        ))}
        slotProps={{
          secondary: {
            noWrap: true,
            sx: { typography: 'caption' },
          },
        }}
      />

      <Box sx={{ gap: 0.75, display: 'flex' }}>
        {[...labels].reverse().map((label) => (
          <Label key={label} color="default">
            {label}
          </Label>
        ))}
      </Box>
    </ListItemButton>
  );
}
