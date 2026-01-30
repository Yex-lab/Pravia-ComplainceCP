'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';

import { Scrollbar } from '../../navigation/scrollbar';
import { DataTableToolbar } from './components/data-table-toolbar';
import { DataTableFilters } from './components/data-table-filters';
import { DataTableHeader } from './components/data-table-header';
import { DataTableBody } from './components/data-table-body';
import { DataTablePagination } from './components/data-table-pagination';
import { DataTableConfirmDialog } from './components/data-table-confirm-dialog';

import type { 
  Column, 
  FilterTab, 
  SearchConfig, 
  ActionConfig,
  ConfirmDialogState
} from './types';

interface QueryConfig {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

interface SchemaDataTableProps<T> {
  // Data store
  dataStore: {
    useQuery: (config?: QueryConfig) => { 
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

export function SchemaDataTable<T>({
  dataStore,
  schemaStore,
  onRowSelect,
  onRowClick,
  getRowId,
  enableSelection = true,
  enableDense = true,
  minWidth = 960,
  rowsPerPageOptions = [5, 10, 25],
  title,
  emptyMessage = 'No data found',
  onToast,
  labels = {},
}: SchemaDataTableProps<T>) {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    title: '',
    content: null,
    action: () => {},
  });

  const headerRef = useRef<HTMLTableSectionElement>(null);

  // Get schema configuration
  const { 
    columns = [],
    filterTabs,
    searchConfig,
    actions,
    isLoading: schemaLoading,
    error: schemaError
  } = schemaStore.useQuery();

  // Get data with query configuration
  const { 
    data = [], 
    isLoading: dataLoading, 
    error: dataError,
    totalCount = 0
  } = dataStore.useQuery({
    page,
    pageSize: rowsPerPage,
    sortBy: orderBy as string,
    sortOrder: order,
    search: searchQuery,
    filters,
  });

  const isLoading = schemaLoading || dataLoading;
  const error = schemaError || dataError;

  // Set initial orderBy when columns are loaded
  useEffect(() => {
    if (columns.length > 0 && !orderBy) {
      setOrderBy(columns[0].id);
    }
  }, [columns, orderBy]);

  // Set initial filter tab
  useEffect(() => {
    if (filterTabs && filterTabs.length > 0 && activeTab === 'all') {
      setActiveTab(filterTabs[0].id);
    }
  }, [filterTabs, activeTab]);

  // Filter data based on active tab
  const filteredByTab = useMemo(() => {
    if (!filterTabs || filterTabs.length === 0) return data;
    const activeTabData = filterTabs.find(tab => tab.id === activeTab);
    return activeTabData ? activeTabData.filter(data) : data;
  }, [data, filterTabs, activeTab]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let result = filteredByTab;

    // Apply search filter
    if (searchQuery && searchConfig) {
      result = result.filter((item: T) =>
        searchConfig.searchFields.some((field) =>
          String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply additional filters
    Object.entries(filters).forEach(([filterKey, filterValues]) => {
      if (filterValues.length > 0) {
        result = result.filter((item: T) =>
          filterValues.includes(String(item[filterKey as keyof T]))
        );
      }
    });

    return result;
  }, [filteredByTab, searchQuery, searchConfig, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Event handlers
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
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(selectedId => selectedId !== id);
    }

    setSelected(newSelected);
    onRowSelect?.(newSelected);
  }, [selected, onRowSelect]);

  const handleSort = useCallback((property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  }, [orderBy, order]);

  const handleFilterChange = useCallback((filterKey: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [filterKey]: values }));
    setPage(0);
  }, []);

  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    setFilters({});
    setPage(0);
  }, []);

  const canReset = searchQuery !== '' || Object.values(filters).some(f => f.length > 0);

  if (error) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography color="error">
          Error loading data: {error.message || 'Unknown error'}
        </Typography>
      </Card>
    );
  }

  return (
    <Card>
      {title && (
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}

      {searchConfig && (
        <DataTableToolbar
          searchConfig={searchConfig}
          searchQuery={searchQuery}
          filters={filters}
          canReset={canReset}
          actions={actions}
          selectedIds={selected}
          labels={labels}
          onSearchChange={setSearchQuery}
          onFilterChange={handleFilterChange}
          onActionsClick={() => {}}
          onClearAll={handleClearAll}
        />
      )}

      {filterTabs && filterTabs.length > 0 && (
        <DataTableFilters
          filterTabs={filterTabs}
          activeTab={activeTab}
          sortedDataLength={sortedData.length}
          labels={labels}
          getTabCount={(tab) => {
            const tabData = tab.filter(data);
            return tabData.length > 99 ? '99+' : tabData.length;
          }}
          onTabChange={setActiveTab}
        />
      )}

      <Box>
        <Scrollbar 
          fillContent={false}
          sx={{ 
            '& .simplebar-content': {
              display: 'block',
            },
          }}
        >
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth }}>
            <DataTableHeader
              ref={headerRef}
              columns={columns}
              enableSelection={enableSelection}
              selected={selected}
              paginatedData={paginatedData}
              dense={dense}
              orderBy={orderBy as any}
              order={order}
              onSelectAll={handleSelectAll}
              onSort={handleSort as any}
            />
            <DataTableBody
              columns={columns}
              displayData={paginatedData}
              isLoading={isLoading}
              enableSelection={enableSelection}
              selected={selected}
              dense={dense}
              emptyMessage={emptyMessage}
              getRowId={getRowId}
              onRowClick={onRowClick}
              onSelectOne={handleSelectOne}
            />
          </Table>
        </Scrollbar>
      </Box>

      <DataTablePagination
        enableDense={enableDense}
        dense={dense}
        rowsPerPage={rowsPerPage}
        page={page}
        sortedDataLength={sortedData.length}
        labels={labels}
        rowsPerPageOptions={rowsPerPageOptions}
        onDenseChange={setDense}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      <DataTableConfirmDialog
        confirmDialog={confirmDialog}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        onConfirm={() => {
          confirmDialog.action();
          setConfirmDialog(prev => ({ ...prev, open: false }));
        }}
      />
    </Card>
  );
}

export type { SchemaDataTableProps };
