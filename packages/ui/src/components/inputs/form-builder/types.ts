export interface SelectOption {
  label: string;
  value: string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  icon?: string;
  iconColor?: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'password' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'phone' | 'businessPhone' | 'zipcode' | 'autocomplete' | 'divider';
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: SelectOption[];
  freeSolo?: boolean;
  labelIcon?: string;
  labelIconColor?: string;
  dividerStyle?: 'dashed' | 'solid';
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getOptions?: (inputValue: string) => SelectOption[] | Promise<SelectOption[]>;
}

export interface FormFieldRow {
  fields: FormField[];
}

export interface FormBuilderProps {
  rows: FormFieldRow[];
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
  skeleton?: boolean;
  hideSubmitButton?: boolean;
  hideFormElement?: boolean;
  defaultValues?: Record<string, any>;
  form?: any;
}
