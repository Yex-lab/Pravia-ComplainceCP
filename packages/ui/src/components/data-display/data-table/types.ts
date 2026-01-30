import React from 'react';
import type { IconifyName } from '../iconify/register-icons';

// Core DataTable types
export interface Column<T> {
  id: keyof T;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface FilterTab<T> {
  id: string;
  label: string;
  filter: (data: T[]) => T[];
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export interface SearchConfig<T> {
  placeholder?: string;
  searchFields: (keyof T)[];
  filterOptions?: { label: string; value: string; options: string[] }[];
  onSearchChange?: (query: string) => void;
}

export interface ActionConfig {
  label: string;
  icon?: string;
  onClick: (selectedIds: string[]) => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'text' | 'outlined' | 'contained';
}

export interface DataTableProps<T> {
  store?: {
    useQuery: (config?: any) => { data: T[] | undefined; isLoading: boolean; error: any; refetch: () => void };
  };
  // Legacy support - will be deprecated
  queryKey?: string[];
  queryFn?: () => Promise<T[]>;
  
  columns: Column<T>[];
  onRowSelect?: (selectedIds: string[]) => void;
  onRowClick?: (row: T) => void;
  onVisibleDataChange?: (visibleData: T[]) => void;  getRowId: (row: T) => string;
  filterTabs?: FilterTab<T>[];
  searchConfig?: SearchConfig<T>;
  actions?: ActionConfig[];
  actionsComponent?: React.ReactNode;
  enableSelection?: boolean;
  enableDense?: boolean;
  minWidth?: number;
  maxRowHeight?: number;
  minRows?: number;
  rowsPerPageOptions?: number[];
  maxPages?: number;
  title?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  onRefresh?: () => void | Promise<void>;
  refreshTooltip?: string;
  onToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  // Localization
  labels?: {
    search?: string;
    keyword?: string;
    clear?: string;
    resultsFound?: string;
    dense?: string;
    rowsPerPage?: string;
  };
}

export interface SchemaDataTableProps<T> {
  // Data store
  dataStore: {
    useQuery: (config?: any) => { 
      data: T[] | undefined;
      isLoading: boolean;
      error: any;
      refetch: () => void;
      totalCount?: number;
    };
  };
  
  // Schema store
  schemaStore: {
    useQuery: () => {
      columns: Column<T>[];
      filterTabs?: FilterTab<T>[];
      searchConfig?: SearchConfig<T>;
      actions?: ActionConfig[];
      isLoading: boolean;
      error: any;
    };
  };
  
  // UI props
  getRowId: (row: T) => string;
  onRowSelect?: (selectedIds: string[]) => void;
  onRowClick?: (row: T) => void;
  enableSelection?: boolean;
  enableDense?: boolean;
  minWidth?: number;
  rowsPerPageOptions?: number[];
  title?: string;
  emptyMessage?: string;
  onToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  labels?: {
    search?: string;
    keyword?: string;
    clear?: string;
    resultsFound?: string;
    dense?: string;
    rowsPerPage?: string;
  };
}

// Component-specific types (matching actual usage)
export interface DataTableBodyProps<T> {
  columns: Column<T>[];
  displayData: T[];
  isLoading: boolean;
  enableSelection: boolean;
  selected: string[];
  dense: boolean;
  maxRowHeight?: number;
  emptyMessage: string;
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  onSelectOne: (id: string) => void;
}

export interface DataTableConfirmDialogProps {
  confirmDialog: {
    open: boolean;
    title: string;
    content: React.ReactNode;
    action: () => void;
  };
  onClose: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmColor?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export interface DataTableFiltersProps<T> {
  filterTabs: FilterTab<T>[];
  activeTab: string;
  sortedDataLength: number;
  labels?: {
    resultsFound?: string;
  };
  getTabCount: (tab: FilterTab<T>) => number | string;
  onTabChange: (tabId: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void | Promise<void>;
  refreshTooltip?: string;
}

export interface DataTableHeaderProps<T> {
  columns: Column<T>[];
  enableSelection: boolean;
  selected: string[];
  paginatedData: T[];
  dense: boolean;
  orderBy: keyof T;
  order: 'asc' | 'desc';
  onSelectAll: (checked: boolean) => void;
  onSort: (property: keyof T) => void;
}

export interface DataTablePaginationProps {
  enableDense: boolean;
  dense: boolean;
  rowsPerPage: number;
  page: number;
  sortedDataLength: number;
  rowsPerPageOptions: number[];
  labels?: {
    dense?: string;
    rowsPerPage?: string;
  };
  maxPages?: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onDenseChange: (dense: boolean) => void;
}

export interface DataTableSearchProps<T> {
  searchConfig: SearchConfig<T>;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, string[]>;
  onFilterChange: (filterKey: string, values: string[]) => void;
  labels?: {
    search?: string;
    keyword?: string;
  };
  isLoading?: boolean;
}

export interface DataTableToolbarProps<T> {
  searchConfig?: SearchConfig<T>;
  actions?: ActionConfig[];
  actionsComponent?: React.ReactNode;
  selectedIds: string[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, string[]>;
  onFilterChange: (filterKey: string, values: string[]) => void;
  canReset: boolean;
  labels?: {
    search?: string;
    keyword?: string;
    clear?: string;
  };
  onActionsClick: (event: React.MouseEvent<HTMLElement>) => void;
  onClearAll: () => void;
  isLoading?: boolean;
}

export interface ConfirmDialogState {
  open: boolean;
  title: string;
  content: React.ReactNode;
  action: () => void;
}

// Cell types (matching actual usage)
export interface ActionItem {
  id?: string;
  label: string;
  icon?: IconifyName | React.ReactNode;
  onClick: () => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
}

export interface ActionsCellProps {
  actions: ActionItem[];
  moreIcon?: IconifyName;
}

export interface AvatarNameCellProps {
  name: string;
  avatar?: string;
  subtitle?: string;
  email?: string;
  avatarSrc?: string;
  href?: string;
  onClick?: () => void;
  component?: React.ElementType;
  showAvatar?: boolean;
  isPrimary?: boolean;
}

export interface ChipCellProps {
  value: string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined' | 'soft';
  fallback?: string;
}

export interface DateCellProps {
  date?: string | Date;
  value?: string | Date;
  format?: string;
  fallback?: string;
  variant?: 'body1' | 'body2' | 'caption' | 'subtitle1' | 'subtitle2';
}

export interface SwitchCellProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export interface TextCellProps {
  value?: string | number | null;
  variant?: 'body1' | 'body2' | 'caption' | 'subtitle1' | 'subtitle2';
  color?: 'inherit' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error';
  fallback?: string;
  noWrap?: boolean;
}
