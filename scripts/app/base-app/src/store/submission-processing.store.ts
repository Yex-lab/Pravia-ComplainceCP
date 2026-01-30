import { create } from 'zustand';

type ProcessingWidgetState = {
  activeSubmissionId: string | null;
  fileName: string | null;

  // UI
  isOpen: boolean;
  isVisible: boolean;

  start: (args: { submissionId: string; fileName: string }) => void;
  stop: () => void;

  toggleOpen: () => void;
  hide: () => void;
  show: () => void;
};

export const useSubmissionProcessingStore = create<ProcessingWidgetState>((set) => ({
  activeSubmissionId: null,
  fileName: null,

  isOpen: true,
  isVisible: true,

  start: ({ submissionId, fileName }) =>
    set({
      activeSubmissionId: submissionId,
      fileName,
      isVisible: true,
      isOpen: true,
    }),

  stop: () =>
    set({
      activeSubmissionId: null,
      fileName: null,
      isVisible: false,
      isOpen: true,
    }),

  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  hide: () => set({ isVisible: false }),
  show: () => set({ isVisible: true }),
}));
