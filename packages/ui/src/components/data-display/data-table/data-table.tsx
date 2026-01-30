'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover'; 
import { Scrollbar } from '../../navigation/scrollbar';
import { DataTableToolbar } from './components/data-table-toolbar';
import { DataTableFilters } from './components/data-table-filters';
import { DataTableHeader } from './components/data-table-header';
import { DataTableBody } from './components/data-table-body';
import { DataTableSkeleton } from './components/data-table-skeleton';
import { DataTablePagination } from './components/data-table-pagination';
import { DataTableConfirmDialog } from './components/data-table-confirm-dialog';
import { Iconify } from '../iconify';
import type { 
  DataTableProps, 
  FilterTab} from './types';
 

export type { Column, DataTableProps, FilterTab, SearchConfig, ActionConfig } from './types';

export function DataTable<T>({
  store,
  queryKey,
  queryFn,
  columns,
  onRowSelect,
  onRowClick,
  onVisibleDataChange,  getRowId,
  filterTabs,
  searchConfig,
  actions,
  actionsComponent, 
  enableSelection = true,
  enableDense = true,
  minWidth = 960,
  maxRowHeight,
  minRows = 3,
  rowsPerPageOptions = [5, 10, 25],
  maxPages,
  title,
  emptyMessage = 'No data found',
  loadingMessage = 'Loading...',
  onRefresh,
  refreshTooltip,
  onToast,
  labels = {},
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof T>(columns[0]?.id);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState(filterTabs?.[0]?.id || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    searchConfig?.onSearchChange?.(value);
  }, [searchConfig]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    content: React.ReactNode;
    action: () => void;
  }>({ open: false, title: '', content: null, action: () => {} });
  
  const headerRef = useRef<HTMLTableSectionElement>(null);

  // Use store if provided, otherwise fall back to legacy query
  const legacyQuery = useQuery({
    queryKey: queryKey || [],
    queryFn: queryFn || (() => Promise.resolve([])),
    enabled: !store && !!queryKey && !!queryFn,
  });

  const storeQuery = store?.useQuery();
  
  const { data = [], isLoading, error } = store ? storeQuery! : legacyQuery;

  // Filter data based on active tab
  const filteredByTab = useMemo(() => {
    if (!filterTabs || filterTabs.length === 0) return data || [];
    const activeTabData = filterTabs.find(tab => tab.id === activeTab);
    return activeTabData?.filter(data || []) || data || [];
  }, [data, filterTabs, activeTab]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let result = filteredByTab || [];

    // Apply search filter
    if (searchQuery && searchConfig) {
      result = result.filter((item) =>
        searchConfig.searchFields.some((field) =>
          String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply additional filters
    Object.entries(filters).forEach(([filterKey, filterValues]) => {
      if (filterValues.length > 0) {
        result = result.filter((item) =>
          filterValues.some((filterValue) => String(item[filterKey as keyof T]).toLowerCase() === filterValue.toLowerCase())
        );
      }
    });

    return result;
  }, [filteredByTab, searchQuery, searchConfig, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  // Calculate counts for filter tabs considering search and additional filters
  const getTabCount = useCallback((tab: FilterTab<T>) => {
    if (isLoading) return 0;
    
    // Apply tab filter
    let result = tab.filter(data);
    
    // Apply search filter
    if (searchQuery && searchConfig) {
      result = result.filter((item) =>
        searchConfig.searchFields.some((field) =>
          String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    // Apply additional filters
    Object.entries(filters).forEach(([filterKey, filterValues]) => {
      if (filterValues.length > 0) {
        result = result.filter((item) =>
          filterValues.some((filterValue) => String(item[filterKey as keyof T]).toLowerCase() === filterValue.toLowerCase())
        );
      }
    });
    
    return result.length;
  }, [data, isLoading, searchQuery, searchConfig, filters]);

  // Paginate data
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Call onVisibleDataChange when paginatedData changes
  useEffect(() => {
    onVisibleDataChange?.(paginatedData);
  }, [paginatedData, onVisibleDataChange]);  const handleSort = useCallback((property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const newSelected = paginatedData.map(getRowId);
      setSelected(newSelected);
      onRowSelect?.(newSelected);
    } else {
      setSelected([]);
      onRowSelect?.([]);
    }
  }, [paginatedData, getRowId, onRowSelect]);

  const handleSelectOne = useCallback((id: string) => {
    const newSelected = selected.includes(id) 
      ? selected.filter(selectedId => selectedId !== id)
      : [...selected, id];
    setSelected(newSelected);
    onRowSelect?.(newSelected);
  }, [selected, onRowSelect]);

  const handleFilterChange = useCallback((filterKey: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [filterKey]: values }));
    setPage(0);
  }, []);

  const handleActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmAction = useCallback((title: string, content: React.ReactNode, action: () => void) => {
    setConfirmDialog({ open: true, title, content, action });
  }, []);

  const handleCloseConfirmDialog = useCallback(() => {
    setConfirmDialog({ open: false, title: '', content: null, action: () => {} });
  }, []);

  const canReset = useMemo(() => {
    return !!searchQuery || Object.values(filters).some(f => f.length > 0);
  }, [searchQuery, filters]);

  // Use empty array for loading state to show skeleton rows
  const displayData = isLoading ? [] : paginatedData;

  // TODO: Consider re-enabling this error UI - currently commented out to preserve table structure on errors
  // if (error) {
  //   return (
  //     <Card sx={{ p: 3 }}>
  //       <Alert severity="error">
  //         Error loading data. Please try again.
  //       </Alert>
  //     </Card>
  //   );
  // }

  const notFound = (!filteredData.length && canReset) || !filteredData.length;

  // Calculate table height based on rows
  const rowHeight = dense ? 56 : 76;
  const headerHeight = dense ? 38 : 58;
  const actualRows = Math.max(Math.min(displayData.length, rowsPerPage), minRows);
  const tableHeight = headerHeight + (rowHeight * actualRows);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      {filterTabs && filterTabs.length > 0 && (
        <DataTableFilters
          filterTabs={filterTabs}
          activeTab={activeTab}
          sortedDataLength={sortedData.length}
          labels={labels}
          getTabCount={getTabCount}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            setPage(0);
          }}
          isLoading={isLoading}
          onRefresh={onRefresh}
          refreshTooltip={refreshTooltip}
        />
      )}
      
      {searchConfig && (
        <DataTableToolbar
          searchConfig={searchConfig}
          searchQuery={searchQuery}
          filters={filters}
          canReset={canReset}
          actions={actions}
          actionsComponent={actionsComponent}
          selectedIds={selected}
          labels={labels}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onActionsClick={handleActionsClick}
          onClearAll={() => {
            setSearchQuery('');
            setFilters({});
            setPage(0);
          }}
          isLoading={isLoading}
        />
      )}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleActionsClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList sx={{ py: 1 }}>
          <MenuItem onClick={() => { console.log('Print'); handleActionsClose(); }}>
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <Iconify icon="solar:pen-bold" />
            </Box>
            <ListItemText>Print</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { console.log('Import'); handleActionsClose(); }}>
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <Iconify icon="solar:import-bold" />
            </Box>
            <ListItemText>Import</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { console.log('Export'); handleActionsClose(); }}>
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <Iconify icon="solar:export-bold" />
            </Box>
            <ListItemText>Export</ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>

      <Box sx={{ position: 'relative', flex: '0 0 auto', height: tableHeight }}>
        {enableSelection && selected.length > 0 && (
          <Box
            sx={{
              pl: 1,
              pr: 2,
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9,
              height: headerRef.current?.offsetHeight || (dense ? 38 : 58),
              display: 'flex',
              position: 'absolute',
              alignItems: 'center',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
            }}
          >
            <Checkbox
              size="small"
              indeterminate={selected.length > 0 && selected.length < paginatedData.length}
              checked={paginatedData.length > 0 && selected.length === paginatedData.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <Typography
              variant="subtitle2"
              sx={{
                ml: 2,
                flexGrow: 1,
                color: 'primary.main',
                ...(dense && { ml: 3 }),
              }}
            >
              {selected.length} selected
            </Typography>
            <Tooltip title="Delete">
              <IconButton
                color="primary"
                onClick={() => {
                  handleConfirmAction(
                    'Delete',
                    <>Are you sure you want to delete <strong>{selected.length}</strong> items?</>,
                    () => {
                      console.log('Delete:', selected);
                      setSelected([]);
                      onToast?.('Items deleted successfully', 'success');
                    }
                  );
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <Scrollbar
          fillContent={false}
          autoHide={false}
        >
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth }}>
            {isLoading ? (
              <DataTableSkeleton
                columns={columns.length}
                rows={rowsPerPage}
                enableSelection={enableSelection}
                dense={dense}
              />
            ) : (
              <>
                <DataTableHeader
                  ref={headerRef}
                  columns={columns}
                  enableSelection={enableSelection}
                  selected={selected}
                  paginatedData={paginatedData}
                  dense={dense}
                  orderBy={orderBy}
                  order={order}
                  onSelectAll={handleSelectAll}
                  onSort={handleSort}
                />
                <DataTableBody
                  columns={columns}
                  displayData={displayData}
                  isLoading={isLoading}
                  enableSelection={enableSelection}
                  selected={selected}
                  dense={dense}
                  maxRowHeight={maxRowHeight}
                  emptyMessage={emptyMessage}
                  getRowId={getRowId}
                  onRowClick={onRowClick}
                  onSelectOne={handleSelectOne}
                />
              </>
            )}
          </Table>
        </Scrollbar>
      </Box>

      <Box sx={{ pt: 2 }}>
        <DataTablePagination
          enableDense={enableDense}
          dense={dense}
          rowsPerPage={rowsPerPage}
          page={page}
          sortedDataLength={sortedData.length}
          labels={labels}
          rowsPerPageOptions={rowsPerPageOptions}
          maxPages={maxPages}
          onDenseChange={setDense}
          onRowsPerPageChange={setRowsPerPage}
          onPageChange={setPage}
        />
      </Box>

      <DataTableConfirmDialog
        confirmDialog={confirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={() => {
          confirmDialog.action();
          handleCloseConfirmDialog();
        }}
      />
    </Card>
  );
}
