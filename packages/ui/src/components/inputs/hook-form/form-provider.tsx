'use client';

import type { UseFormReturn } from 'react-hook-form';

import { FormProvider as RHFForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export type FormProps = {
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
  children: React.ReactNode;
  methods: UseFormReturn<any>;
};

export function Form({ children, onSubmit, methods }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    console.log('Form: onSubmit event fired', { hasHandler: !!onSubmit });
    if (onSubmit) {
      onSubmit(e as any);
    }
  };

  return (
    <RHFForm {...methods}>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  );
}
