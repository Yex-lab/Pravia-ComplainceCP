import React from 'react';
import { TextField, type TextFieldProps } from '@mui/material';

export interface ZipCodeInputProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
}

export function ZipCodeInput({ value = '', onChange, ...props }: ZipCodeInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/\D/g, '').slice(0, 5);
    onChange?.(cleaned);
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      inputProps={{
        inputMode: 'numeric',
        pattern: '[0-9]*',
        maxLength: 5,
        ...props.inputProps,
      }}
      placeholder={props.placeholder || '12345'}
    />
  );
}
