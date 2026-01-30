export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  maxWidth?: 'xs' | 'sm' | 'md';
}

export interface ConfirmationDialogContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}
