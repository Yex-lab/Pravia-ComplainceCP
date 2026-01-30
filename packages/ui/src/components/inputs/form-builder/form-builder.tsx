'use client';

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';

import { Iconify } from '../../data-display/iconify';
import { formatPhone, formatBusinessPhone } from '../../../utils/phone.util';

import type { FormBuilderProps, FormField, SelectOption } from './types';
import { createFormSchema } from './schema';
import { PhoneInput } from '../phone-input';
import { ZipCodeInput } from '../zipcode-input';

export function FormBuilder({ rows = [], onSubmit, loading = false, skeleton = false, hideSubmitButton = false, hideFormElement = false, defaultValues, form: externalForm }: FormBuilderProps) {
  // Extract all fields from rows for schema creation
  const fields = useMemo(() => rows.flatMap(row => row.fields), [rows]);
  
  const schema = createFormSchema(fields);
  
  const formDefaultValues = defaultValues || fields.reduce((acc, field) => {
    switch (field.type) {
      case 'number':
        acc[field.name] = 0;
        break;
      case 'multiselect':
        acc[field.name] = [];
        break;
      case 'checkbox':
        acc[field.name] = false;
        break;
      case 'date':
        acc[field.name] = null;
        break;
      case 'phone':
        acc[field.name] = '';
        break;
      case 'businessPhone':
        acc[field.name] = '';
        break;
      case 'zipcode':
        acc[field.name] = '';
        break;
      default:
        acc[field.name] = '';
    }
    return acc;
  }, {} as Record<string, any>);

  const methods = externalForm || useForm({
    resolver: zodResolver(schema),
    defaultValues: formDefaultValues,
  });

  const { control, handleSubmit, formState, reset } = methods;
  const errors = formState?.errors || {};

  // Reset form when defaultValues change
  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = handleSubmit((data: Record<string, any>) => {
    onSubmit(data);
  });

  const getErrorMessage = (fieldName: string) => {
    const error = errors[fieldName];
    return error?.message?.toString() || '';
  };

  const renderLabel = (field: FormField) => {
    if (!field.labelIcon) return field.label;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Iconify icon={field.labelIcon as any} sx={{ width: 18, height: 18, color: field.labelIconColor || 'primary.main' }} />
        {field.label}
      </Box>
    );
  };

  const renderSkeletonField = (field: FormField) => {
    return (
      <Box key={field.id}>
        {field.type === 'checkbox' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="rectangular" width={20} height={20} sx={{ borderRadius: 0.5 }} />
            <Skeleton variant="text" width="60%" height={24} />
          </Box>
        ) : (
          <Box>
            <Skeleton variant="text" width="30%" height={16} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
          </Box>
        )}
      </Box>
    );
  };

  const renderField = (field: FormField) => {
    if (skeleton) {
      return renderSkeletonField(field);
    }

    const fieldComponent = (() => {
      switch (field.type) {
        case 'select':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <TextField
                  {...formField}
                  value={formField.value ?? ''}
                  select
                  fullWidth
                  label={renderLabel(field)}
                  placeholder={field.placeholder}
                  helperText={getErrorMessage(field.name) || field.helperText}
                  error={!!errors[field.name]}
                  required={field.required}
                  disabled={(field as any).disabled || false}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 8,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: field.labelIcon ? (
                      <InputAdornment position="start">
                        <Iconify icon={field.labelIcon as any} sx={{ ml: 1, mr: 1, color: field.labelIconColor || 'text.disabled' }} />
                      </InputAdornment>
                    ) : undefined,
                  }}
                >
                  {field.options?.map((option: SelectOption) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.icon && (
                        <Iconify icon={option.icon as any} sx={{ mr: 1, width: 20, height: 20, color: option.iconColor || 'primary.main' }} />
                      )}
                      {option.color ? (
                        <Chip label={option.label} color={option.color} size="small" />
                      ) : (
                        option.label
                      )}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          );

        case 'multiselect':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <FormControl fullWidth error={!!errors[field.name]}>
                  <InputLabel>{renderLabel(field)}</InputLabel>
                  <Select
                    {...formField}
                    value={formField.value || []}
                    multiple
                    disabled={(field as any).disabled || false}
                    label={renderLabel(field)}
                    endAdornment={
                      formField.value && (formField.value as string[]).length > 0 ? (
                        <InputAdornment position="end" sx={{ mr: 3 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              formField.onChange([]);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <Iconify icon="solar:close-circle-bold" sx={{ width: 20, height: 20 }} />
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, overflow: 'hidden' }}>
                        {(selected as string[]).map((value) => {
                          const option = field.options?.find((opt: SelectOption) => opt.value === value);
                          return (
                            <Chip
                              key={value}
                              label={option?.label || value}
                              size="small"
                              sx={{
                                maxWidth: '100%',
                                height: 'auto',
                                '& .MuiChip-label': {
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'normal',
                                  py: 0.5,
                                },
                              }}
                              onDelete={() => {
                                const newValue = (formField.value as string[]).filter((v) => v !== value);
                                formField.onChange(newValue);
                              }}
                              onMouseDown={(event) => {
                                event.stopPropagation();
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 8, // 8 items
                        },
                        sx: {
                          maxWidth: 250,
                          '& .MuiMenuItem-root': {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                        },
                      },
                    }}
                    startAdornment={
                      field.labelIcon ? (
                        <InputAdornment position="start">
                          <Iconify icon={field.labelIcon as any} sx={{ color: field.labelIconColor || 'text.disabled' }} />
                        </InputAdornment>
                      ) : undefined
                    }
                  >
                    {field.options?.map((option: SelectOption) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.icon && (
                          <Iconify icon={option.icon as any} sx={{ mr: 1, width: 20, height: 20, color: option.iconColor || 'primary.main', flexShrink: 0 }} />
                        )}
                        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {(getErrorMessage(field.name) || field.helperText) && (
                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                      {getErrorMessage(field.name) || field.helperText}
                    </Box>
                  )}
                </FormControl>
              )}
            />
          );

case 'checkbox':
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: formField }) => (
        <Box sx={{ ml: 1.75 }}>
          <FormControlLabel
            control={
              <Checkbox
                {...formField}
                checked={Boolean(formField.value)}
                disabled={Boolean((field as any).disabled)}
                onChange={(e, checked) => formField.onChange(checked)}
              />
            }
            label={renderLabel(field)}
          />
          {(getErrorMessage(field.name) || field.helperText) && (
            <Box sx={{ color: 'error.main', fontSize: '0.75rem', ml: 4 }}>
              {getErrorMessage(field.name) || field.helperText}
            </Box>
          )}
        </Box>
      )}
    />
  );

        case 'date':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <DatePicker
                  {...formField}
                  label={renderLabel(field)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors[field.name],
                      helperText: getErrorMessage(field.name) || field.helperText,
                      required: field.required,
                    },
                  }}
                />
              )}
            />
          );

        case 'phone':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <TextField
                  {...formField}
                  label={renderLabel(field)}
                  placeholder={field.placeholder}
                  helperText={getErrorMessage(field.name) || field.helperText}
                  error={!!errors[field.name]}
                  required={field.required}
                  disabled={(field as any).disabled || false}
                  fullWidth
                  value={formField.value || ''}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    formField.onChange(formatted);
                  }}
                  InputProps={{
                    startAdornment: field.labelIcon ? (
                      <InputAdornment position="start">
                        <Iconify icon={field.labelIcon as any} sx={{ color: field.labelIconColor || 'text.secondary' }} />
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              )}
            />
          );

        case 'businessPhone':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <TextField
                  {...formField}
                  label={renderLabel(field)}
                  placeholder={field.placeholder}
                  helperText={getErrorMessage(field.name) || field.helperText}
                  error={!!errors[field.name]}
                  required={field.required}
                  disabled={(field as any).disabled || false}
                  fullWidth
                  value={formField.value || ''}
                  onChange={(e) => {
                    const formatted = formatBusinessPhone(e.target.value);
                    formField.onChange(formatted);
                  }}
                  InputProps={{
                    startAdornment: field.labelIcon ? (
                      <InputAdornment position="start">
                        <Iconify icon={field.labelIcon as any} sx={{ color: field.labelIconColor || 'text.secondary' }} />
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              )}
            />
          );

        case 'autocomplete':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <Autocomplete
                  {...formField}
                  value={
                    field.freeSolo 
                      ? formField.value || ''
                      : field.options?.find(opt => opt.value === formField.value) || null
                  }
                  onChange={(_, newValue) => {
                    if (field.freeSolo) {
                      formField.onChange(typeof newValue === 'string' ? newValue : newValue?.value || '');
                    } else {
                      formField.onChange(newValue?.value || '');
                    }
                  }}
                  onInputChange={field.freeSolo ? (_, newInputValue) => {
                    formField.onChange(newInputValue);
                  } : undefined}
                  freeSolo={field.freeSolo}
                  options={field.options || []}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                  isOptionEqualToValue={(option, value) => 
                    typeof option === 'string' 
                      ? option === value 
                      : option.value === (typeof value === 'string' ? value : value.value)
                  }
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    if (typeof option === 'string') {
                      return (
                        <Box component="li" key={key} {...otherProps}>
                          {option}
                        </Box>
                      );
                    }
                    return (
                      <Box component="li" key={key} {...otherProps} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon && (
                          <Chip 
                            label={option.icon} 
                            size="small" 
                            color={option.color || 'default'}
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                        <Box component="span" sx={{ fontSize: '0.875rem' }}>
                          {option.label}
                        </Box>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={renderLabel(field)}
                      placeholder={field.placeholder}
                      helperText={getErrorMessage(field.name) || field.helperText}
                      error={!!errors[field.name]}
                      required={field.required}
                    />
                  )}
                  fullWidth
                  disabled={(field as any).disabled || false}
                />
              )}
            />
          );

        case 'zipcode':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <ZipCodeInput
                  {...formField}
                  label={renderLabel(field)}
                  placeholder={field.placeholder}
                  helperText={getErrorMessage(field.name) || field.helperText}
                  error={!!errors[field.name]}
                  required={field.required}
                  disabled={(field as any).disabled || false}
                  fullWidth
                />
              )}
            />
          );

        default:
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: formField }) => (
                <TextField
                  {...formField}
                  value={formField.value ?? ''}
                  fullWidth
                  label={renderLabel(field)}
                  type={field.type === 'number' ? 'text' : field.type}
                  placeholder={field.placeholder}
                  helperText={getErrorMessage(field.name) || field.helperText}
                  error={!!errors[field.name]}
                  required={field.required}
                  disabled={(field as any).disabled || false}
                  onKeyPress={field.onKeyPress}
                  onChange={field.onChange ? (e) => {
                    field.onChange!(e as React.ChangeEvent<HTMLInputElement>);
                    formField.onChange(e.target.value);
                  } : formField.onChange}
                  inputProps={field.type === 'number' ? {
                    inputMode: 'decimal',
                    pattern: '[0-9]*\\.?[0-9]*',
                  } : undefined}
                />
              )}
            />
          );

        case 'divider':
          return (
            <Box sx={{ width: '100%', my: 2 }}>
              <Box
                sx={{
                  borderTop: field.dividerStyle === 'solid' ? '1px solid' : '1px dashed',
                  borderColor: 'divider',
                }}
              />
            </Box>
          );
      }
    })();

    return fieldComponent;
  };

  const formContent = (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        {rows.map((row, rowIndex) => (
          <Box
            key={`row-${rowIndex}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${row.fields.length}, 1fr)`,
              gap: 2,
            }}
          >
            {row.fields.map((field) => (
              <Box key={field.name}>
                {renderField(field)}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      
      {!hideSubmitButton && (
        <Button
          type="submit"
          variant="contained"
          disabled={loading || skeleton}
          sx={{ mt: 3 }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      )}
    </>
  );

  if (hideFormElement) {
    return formContent;
  }

  return (
    <Box component="form" onSubmit={handleFormSubmit} noValidate>
      {formContent}
    </Box>
  );
}
