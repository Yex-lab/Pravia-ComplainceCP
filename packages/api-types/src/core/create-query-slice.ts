import type { StateCreator } from 'zustand';

type QuerySliceConfig<TData = any, TFilters = any> = {
  initialFilters?: TFilters;
  initialData?: TData[];
};

export type QuerySliceState<TData = any, TFilters = any> = {
  data: TData[];
  filters: TFilters;
  selectedIds: string[];
  searchQuery: string;
  setData: (data: TData[]) => void;
  setFilters: (filters: Partial<TFilters>) => void;
  resetFilters: () => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
  setSearchQuery: (query: string) => void;
};

export function createQuerySlice<TData = any, TFilters = any>(
  config: QuerySliceConfig<TData, TFilters>,
): StateCreator<QuerySliceState<TData, TFilters>> {
  return (set) => ({
    // Initial state
    data: config.initialData ?? [],
    filters: config.initialFilters ?? ({} as TFilters),
    selectedIds: [],
    searchQuery: '',

    // Actions
    setData: (data) => set({ data }),

    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

    resetFilters: () => set({ filters: config.initialFilters ?? ({} as TFilters) }),

    setSelectedIds: (ids) => set({ selectedIds: ids }),

    toggleSelected: (id) =>
      set((state) => ({
        selectedIds: state.selectedIds.includes(id)
          ? state.selectedIds.filter((i) => i !== id)
          : [...state.selectedIds, id],
      })),

    clearSelected: () => set({ selectedIds: [] }),

    setSearchQuery: (query) => set({ searchQuery: query }),
  });
}
