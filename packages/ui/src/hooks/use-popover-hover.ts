'use client';

import { useRef, useState, useCallback } from 'react';

interface UsePopoverHoverReturn<T = HTMLElement> {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  anchorEl: T | null;
  elementRef: React.RefObject<T | null>;
}

export function usePopoverHover<T = HTMLElement>(): UsePopoverHoverReturn<T> {
  const elementRef = useRef<T>(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<T | null>(null);

  const onOpen = useCallback(() => {
    if (elementRef.current) {
      setAnchorEl(elementRef.current);
      setOpen(true);
    }
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    setAnchorEl(null);
  }, []);

  return {
    open,
    onOpen,
    onClose,
    anchorEl,
    elementRef,
  };
}
