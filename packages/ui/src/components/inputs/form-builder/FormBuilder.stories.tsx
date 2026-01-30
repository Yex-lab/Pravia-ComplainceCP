import type { Meta, StoryObj } from '@storybook/react-vite';
import { z } from 'zod';
import { FormBuilder } from './form-builder';
import { EnhancedFormBuilder } from './enhanced-form-builder';
import { createFormStore } from '../../utils/form-store';
import type { FormField, FormFieldRow } from './types';

/**
 * FormBuilder is a dynamic form component that generates forms based on field configuration.
 * It supports multiple field types, validation, and flexible layouts.
 * 
 * ## Features
 * - 8 field types: text, email, number, password, select, multiselect, checkbox, date
 * - Dynamic Zod schema validation
 * - Single and two-column layouts
 * - Variable field widths (half/full width)
 * - Loading and skeleton states
 * - React Hook Form integration
 * - Store integration for CRUD operations
 * - MUI component styling
 */
const meta: Meta<typeof FormBuilder> = {
  title: 'Inputs/Form Builder',
  component: FormBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# FormBuilder

A dynamic form component that generates forms based on field configuration with built-in validation and store integration.

## Basic Usage

\`\`\`tsx
import { FormBuilder } from '@asyml8/ui';

const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'age', label: 'Age', type: 'number', min: 18 },
];

<FormBuilder
  fields={fields}
  onSubmit={(data) => console.log(data)}
/>
\`\`\`

## Enhanced Usage with Store Integration

\`\`\`tsx
import { createFormStore, EnhancedFormBuilder } from '@asyml8/ui';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18),
});

const userFormStore = createFormStore({
  schema: userSchema,
  createFn: (data) => createUser(data),
  updateFn: (data) => updateUser(data),
  deleteFn: (id) => deleteUser(id),
  invalidateQueries: [['users']],
});

<EnhancedFormBuilder
  fields={fields}
  store={userFormStore}
  mode="create"
  onSuccess={() => navigate('/users')}
/>
\`\`\`

## Field Types

- **text**: Basic text input
- **email**: Email input with validation
- **password**: Password input (hidden text)
- **number**: Numeric input with min/max validation
- **select**: Single selection dropdown
- **multiselect**: Multiple selection with chips
- **checkbox**: Boolean checkbox
- **date**: Date picker

## Field Configuration

\`\`\`tsx
const field = {
  name: 'email',           // Field identifier
  label: 'Email Address',  // Display label
  type: 'email',          // Field type
  required: true,         // Validation
  placeholder: 'Enter email',
  helperText: 'We will never share your email',
  width: 'half',          // 'half' or 'full'
  options: [...],         // For select/multiselect
  min: 0,                 // For number fields
  max: 100,               // For number fields
};
\`\`\`

## Store Integration Benefits

- **Automatic CRUD**: Create, update, delete operations
- **Validation**: Zod schema validation with TypeScript
- **Cache Management**: Automatic query invalidation
- **Loading States**: Built-in loading indicators
- **Error Handling**: Automatic error display
- **Type Safety**: Full TypeScript support

## Layouts

- **Single Column**: \`columns={1}\` (default)
- **Two Column**: \`columns={2}\`
- **Mixed Width**: Use \`width: 'half'\` or \`width: 'full'\` on fields
        `,
      },
    },
  },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const basicRows: FormFieldRow[] = [
  // Row 1: Single full-width field
  {
    fields: [
      { id: '1', type: 'text', label: 'Full Name', name: 'fullName', required: true, placeholder: 'Enter your full name' }
    ]
  },
  // Row 2: Email and phone side by side
  {
    fields: [
      { id: '2', type: 'email', label: 'Email', name: 'email', required: true, placeholder: 'Enter your email' },
      { id: '5', type: 'phone', label: 'Phone Number', name: 'phone', placeholder: 'Enter your phone number' }
    ]
  },
  // Row 3: Age and password
  {
    fields: [
      { id: '3', type: 'number', label: 'Age', name: 'age', required: false, placeholder: '25' },
      { id: '4', type: 'password', label: 'Password', name: 'password', required: true, helperText: 'Minimum 6 characters' }
    ]
  }
];

const twoColumnRows: FormFieldRow[] = [
  { fields: [
    { id: '1', type: 'text', label: 'First Name', name: 'firstName', required: true },
    { id: '2', type: 'text', label: 'Last Name', name: 'lastName', required: true }
  ]},
  { fields: [{ id: '3', type: 'email', label: 'Email Address', name: 'email', required: true }] },
  { fields: [
    { id: '4', type: 'phone', label: 'Phone', name: 'phone', required: false },
    { id: '5', type: 'select', label: 'Country', name: 'country', required: true, options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
      { label: 'United Kingdom', value: 'uk' }
    ]}
  ]},
  { fields: [{ id: '6', type: 'multiselect', label: 'Interests', name: 'interests', required: false, options: [
    { label: 'Technology', value: 'tech' },
    { label: 'Sports', value: 'sports' },
    { label: 'Music', value: 'music' },
    { label: 'Travel', value: 'travel' }
  ]}] },
  { fields: [{ id: '7', type: 'checkbox', label: 'Subscribe to newsletter', name: 'newsletter', required: false }] }
];

const complexRows: FormFieldRow[] = [
  { fields: [{ id: '1', type: 'text', label: 'Company Name', name: 'company', required: true }] },
  { fields: [
    { id: '2', type: 'text', label: 'Contact Person', name: 'contact', required: true },
    { id: '3', type: 'email', label: 'Business Email', name: 'businessEmail', required: true }
  ]},
  { fields: [
    { id: '4', type: 'select', label: 'Industry', name: 'industry', required: true, options: [
      { label: 'Technology', value: 'tech' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Finance', value: 'finance' }
    ]},
    { id: '5', type: 'number', label: 'Employees', name: 'employees', required: true }
  ]},
  { fields: [{ id: '6', type: 'multiselect', label: 'Services Required', name: 'services', required: true, options: [
    { label: 'Web Development', value: 'web' },
    { label: 'Mobile Apps', value: 'mobile' },
    { label: 'Cloud Services', value: 'cloud' },
    { label: 'Consulting', value: 'consulting' }
  ]}] }
];

/**
 * Basic single-column form with standard input types.
 * Demonstrates text, email, number, and password fields.
 */
export const Basic: Story = {
  args: {
    rows: basicRows,
    onSubmit: (data: Record<string, any>) => console.log('Basic form:', data),
    loading: false
  },
};

/**
 * Two-column layout with mixed field widths.
 * Shows how fields can span half-width (1) or full-width (2) in a two-column layout.
 */
export const TwoColumn: Story = {
  args: {
    rows: twoColumnRows,
    onSubmit: (data: Record<string, any>) => console.log('Two column form:', data),
    loading: false
  },
};

/**
 * Complex business form with advanced field types.
 * Demonstrates select, multiselect, and strategic field width usage.
 */
export const ComplexTwoColumn: Story = {
  args: {
    rows: complexRows,
    onSubmit: (data: Record<string, any>) => console.log('Complex two column:', data),
    loading: false
  },
};

/**
 * Form in loading state during submission.
 * Submit button shows "Submitting..." and is disabled.
 */
export const Loading: Story = {
  args: {
    rows: basicRows,
    onSubmit: (data: Record<string, any>) => console.log('Loading form:', data),
    loading: true
  },
};

/**
 * Skeleton loading state for better UX.
 * Shows placeholder skeletons while form data is loading.
 */
export const SkeletonLoading: Story = {
  args: {
    rows: basicRows,
    onSubmit: (data: Record<string, any>) => console.log('Skeleton form:', data),
    skeleton: true
  },
};

/**
 * Two-column skeleton loading state.
 * Demonstrates skeleton placeholders in a two-column layout.
 */
export const SkeletonTwoColumn: Story = {
  args: {
    rows: twoColumnRows,
    onSubmit: (data: Record<string, any>) => console.log('Skeleton two column:', data),
    skeleton: true
  },
};

export const PhoneFieldDemo: Story = {
  args: {
    rows: [
      { fields: [
        { id: 'phone1', type: 'phone', label: 'Primary Phone', name: 'primaryPhone', required: true, placeholder: 'Enter primary phone' },
        { id: 'phone2', type: 'phone', label: 'Secondary Phone', name: 'secondaryPhone', placeholder: 'Enter secondary phone' }
      ]},
      { fields: [
        { id: 'name', type: 'text', label: 'Full Name', name: 'name', required: true },
        { id: 'email', type: 'email', label: 'Email', name: 'email', required: true }
      ]}
    ],
    onSubmit: (data) => console.log('Phone form submitted:', data),
  },
};

export const RowBasedTest: Story = {
  args: {
    rows: [
      // Row 1: Single field
      {
        fields: [
          { id: 'title', name: 'title', label: 'Title', type: 'text' }
        ]
      },
      // Row 2: Two fields
      {
        fields: [
          { id: 'firstName', name: 'firstName', label: 'First Name', type: 'text' },
          { id: 'lastName', name: 'lastName', label: 'Last Name', type: 'text' }
        ]
      }
    ],
    onSubmit: (data) => console.log('Row-based form submitted:', data),
  },
};
