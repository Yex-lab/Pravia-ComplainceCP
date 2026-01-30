import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import type { Theme, SxProps, CSSObject } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Item
 */
export type NavItemRenderProps = {
  navIcon?: Record<string, React.ReactNode>;
  navInfo?: (val: string) => Record<string, React.ReactElement>;
};

export type NavItemStateProps = {
  open?: boolean;
  active?: boolean;
  disabled?: boolean;
};

export type NavItemSlotProps = {
  sx?: SxProps<Theme>;
  icon?: SxProps<Theme>;
  texts?: SxProps<Theme>;
  title?: SxProps<Theme>;
  caption?: SxProps<Theme>;
  info?: SxProps<Theme>;
  label?: SxProps<Theme>;
  arrow?: SxProps<Theme>;
};

export type NavSlotProps = {
  rootItem?: NavItemSlotProps;
  subItem?: NavItemSlotProps;
  subheader?: SxProps<Theme>;
  dropdown?: {
    paper?: SxProps<Theme>;
  };
};

export type NavItemOptionsProps = {
  depth?: number;
  hasChild?: boolean;
  externalLink?: boolean;
  enabledRootRedirect?: boolean;
  render?: NavItemRenderProps;
  slotProps?: NavItemSlotProps;
};

export type NavLabelConfig = {
  /**
   * Label content
   */
  content: string | React.ReactNode;
  /**
   * Label color
   * @default 'primary'
   */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /**
   * Label style variant
   * @default 'soft'
   */
  variant?: 'filled' | 'soft' | 'outlined' | 'inverted';
  /**
   * Icon at the start of the label
   */
  startIcon?: React.ReactNode;
  /**
   * Icon at the end of the label
   */
  endIcon?: React.ReactNode;
};

export type NavItemDataProps = Pick<NavItemStateProps, 'disabled'> & {
  path: string;
  title: string;
  icon?: string | React.ReactNode;
  info?: string[] | React.ReactNode;
  label?: string | React.ReactNode | NavLabelConfig;
  caption?: string;
  deepMatch?: boolean;
  allowedRoles?: string | string[];
  children?: NavItemDataProps[];
};

export type NavItemProps = ButtonBaseProps &
  NavItemDataProps &
  NavItemStateProps &
  NavItemOptionsProps & {
    // RouterLink component for React Router navigation
    RouterLink?: React.ComponentType<any>;
  };

/**
 * List
 */
export type NavListProps = Pick<NavItemProps, 'render' | 'depth' | 'enabledRootRedirect' | 'RouterLink'> & {
  cssVars?: CSSObject;
  data: NavItemDataProps;
  slotProps?: NavSlotProps;
  checkPermissions?: (allowedRoles?: NavItemProps['allowedRoles']) => boolean;
};

export type NavSubListProps = Omit<NavListProps, 'data'> & {
  data: NavItemDataProps[];
};

export type NavGroupProps = Omit<NavListProps, 'data' | 'depth'> & {
  subheader?: string;
  items: NavItemDataProps[];
};

/**
 * Main
 */
export type NavSectionProps = React.ComponentProps<'nav'> &
  Omit<NavListProps, 'data' | 'depth'> & {
    sx?: SxProps<Theme>;
    data: {
      subheader?: string;
      items: NavItemDataProps[];
    }[];
    /**
     * Use primary theme color for active items (icon and text)
     * @default true
     */
    usePrimaryColor?: boolean;
    /**
     * Hide labels in mini navigation (show icons only)
     * Only applies to NavSectionMini
     * @default false
     */
    hideLabels?: boolean;
    /**
     * RouterLink component for React Router navigation
     * Prevents hard page refreshes when navigating
     */
    RouterLink?: React.ComponentType<any>;
  };
