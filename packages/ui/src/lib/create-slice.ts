import type { StateCreator } from 'zustand';

export function createSlice<TState extends object, TActions = {}>(
  initialState: TState,
  actions: (
    set: (partial: Partial<TState> | ((state: TState & TActions) => Partial<TState>)) => void,
    get: () => TState & TActions
  ) => TActions
): StateCreator<TState & TActions> {
  return (set, get) => ({
    ...initialState,
    ...actions(set as any, get as any),
  });
}
