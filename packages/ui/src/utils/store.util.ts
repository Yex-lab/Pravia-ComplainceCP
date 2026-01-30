/**
 * Wires a generated slice's StateCreator to Zustand's nested state structure.
 *
 * @param sliceName - The key in state.slices where this slice lives
 * @param sliceCreator - The generated slice's createSlice function (StateCreator)
 * @param set - Zustand's set function
 * @param get - Zustand's get function
 * @returns The initialized slice with all methods wired to Zustand
 *
 * @example
 * const accountsSlice = registerSlice('accounts', fluxSlices.accounts.createSlice, set, get);
 */
export function registerSlice(
  sliceName: string,
  sliceCreator: (set: (partial: any) => void, get: () => any, api: any) => any,
  set: any,
  get: any
) {
  return sliceCreator(
    (partial: any) =>
      set((state: any) => ({
        ...state,
        slices: {
          ...state.slices,
          [sliceName]:
            typeof partial === 'function'
              ? partial(state.slices[sliceName])
              : { ...state.slices[sliceName], ...partial },
        },
      })),
    () => get().slices[sliceName],
    {} as any
  );
}
