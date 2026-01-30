import * as z from 'zod';
import type { FormField } from './types';

export const createFormSchema = (fields: FormField[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email('Invalid email address');
        break;
      case 'number':
        fieldSchema = z.coerce.number();
        break;
      case 'phone':
        fieldSchema = z.string().refine(
          (val) => {
            if (!val) return true; // Allow empty if not required
            const digits = val.replace(/\D/g, '');
            return digits.length >= 10; // Must have at least 10 digits
          },
          { message: 'Phone number must have at least 10 digits' }
        );
        break;
      case 'businessPhone':
        fieldSchema = z.string().refine(
          (val) => {
            if (!val) return true; // Allow empty if not required
            const digits = val.replace(/\D/g, '');
            return digits.length >= 10; // Must have at least 10 digits (extension optional)
          },
          { message: 'Phone number must have at least 10 digits' }
        );
        break;
      case 'zipcode':
        fieldSchema = z.string().refine(
          (val) => {
            if (!val) return true; // Allow empty if not required
            const digits = val.replace(/\D/g, '');
            return digits.length === 5; // Must have exactly 5 digits
          },
          { message: 'ZIP code must be exactly 5 digits' }
        );
        break;
      case 'select':
        fieldSchema = z.string();
        break;
      case 'autocomplete':
        fieldSchema = z.string();
        break;
      case 'multiselect':
        fieldSchema = z.array(z.string());
        break;
      case 'checkbox':
        fieldSchema = z.boolean();
        break;
      case 'date':
        fieldSchema = z.string().or(z.date());
        break;
      case 'divider':
        // Dividers don't need validation
        return;
      default:
        fieldSchema = z.string();
    }

    if (field.required) {
      if (field.type === 'multiselect') {
        fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).min(1, `${field.label} is required`);
      } else if (field.type === 'checkbox') {
        fieldSchema = (fieldSchema as z.ZodBoolean).refine((val: boolean) => val === true, `${field.label} is required`);
      } else {
        fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
      }
    } else {
      fieldSchema = fieldSchema.optional();
    }

    schemaObject[field.name] = fieldSchema;
  });

  return z.object(schemaObject);
};
