'use client';

import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { FormBuilder } from './form-builder';
import { createFormSchema } from './schema';
import type { FormField, FormFieldRow } from './types';

export interface EnhancedFormBuilderProps {
  rows: FormFieldRow[];
  
  // Store integration
  store?: {
    useForm: (props?: any) => any;
    useCreate?: () => any;
    useUpdate?: () => any;
    useDelete?: () => any;
    schema: z.ZodType;
  };
  
  // Legacy props (still supported)
  onSubmit?: (data: any) => void | Promise<void>;
  defaultValues?: Record<string, any>;
  
  // UI props
  loading?: boolean;
  columns?: number;
  skeleton?: boolean;
  hideSubmitButton?: boolean;
  submitLabel?: string;
  description?: string;
  formRef?: React.RefObject<HTMLFormElement>;
  
  // Mode
  mode?: 'create' | 'update';
  entityId?: string;
  
  // Callbacks
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function EnhancedFormBuilder({
  rows = [],
  store,
  onSubmit,
  defaultValues,
  loading = false,
  columns = 2,
  skeleton = false,
  hideSubmitButton = false,
  submitLabel,
  description,
  formRef,
  mode = 'create',
  entityId,
  onSuccess,
  onError,
}: EnhancedFormBuilderProps) {
  // Extract all fields from rows
  const fields = useMemo(() => rows.flatMap(row => row.fields), [rows]);
  
  // Create default values from fields if not provided
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {};
    fields.forEach(field => {
      switch (field.type) {
        case 'select':
          defaults[field.name] = '';
          break;
        case 'checkbox':
          defaults[field.name] = false;
          break;
        case 'number':
          defaults[field.name] = 0;
          break;
        default:
          defaults[field.name] = '';
      }
    });
    
    // Merge with provided defaultValues
    return { ...defaults, ...(defaultValues || {}) };
  };

  // Use store form or create local form with key for recreation
  const formKey = mode === 'update' && entityId ? `update-${entityId}` : 'create';
  const form = store?.useForm?.({ 
    key: formKey,
    defaultValues: getDefaultValues() 
  }) || useForm({
    resolver: zodResolver(store?.schema || createFormSchema(fields) as any), // Type assertion for v5 compatibility
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  // Get mutations from store if available
  const createMutation = store?.useCreate?.();
  const updateMutation = store?.useUpdate?.();
  const deleteMutation = store?.useDelete?.();

  // Determine which mutation to use
  const mutation = mode === 'update' ? updateMutation : createMutation;
  const isLoading = loading || mutation?.isPending;

  // Handle form submission
  const handleSubmit = async (data: any) => {
    try {
      if (store && mutation) {
        // Use store mutation
        await mutation.mutateAsync(data);
        onSuccess?.(data);
      } else if (onSubmit) {
        // Use legacy onSubmit
        await onSubmit(data);
        onSuccess?.(data);
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteMutation || !entityId) return;
    
    try {
      await deleteMutation.mutateAsync(entityId);
      onSuccess?.(null);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <Box component="form" id="enhanced-form" ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      {/* Description */}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}

      {/* Error display */}
      {mutation?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {mutation.error.message}
        </Alert>
      )}

      {/* Form fields */}
      <FormBuilder
        rows={rows}
        onSubmit={() => {}} // Handled by enhanced version
        loading={isLoading}
        skeleton={skeleton}
        hideSubmitButton={true} // We'll render our own buttons
        form={form} // Pass the form instance
        hideFormElement={true} // Don't render form element to avoid nesting
      />

      {/* Action buttons */}
      {!hideSubmitButton && (
        <Box sx={{ display: 'flex', gap: 2, mt: 4, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {submitLabel || (mode === 'update' ? 'Save' : 'Create')}
          </Button>

          {mode === 'update' && deleteMutation && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={isLoading || deleteMutation.isPending}
            >
              Delete
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
