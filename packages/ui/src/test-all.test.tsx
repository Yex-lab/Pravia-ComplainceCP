import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Test core utilities without importing components that use MUI icons
describe('UI Package', () => {
  it('renders basic elements', () => {
    render(<div>Test Component</div>);
    expect(screen.getByText('Test Component')).toBeTruthy();
  });

  it('can import notification store', async () => {
    const { useNotificationStore } = await import('./components/custom-snackbar/notification-store');
    expect(useNotificationStore).toBeDefined();
    expect(typeof useNotificationStore).toBe('function');
  });

  it('can import form store utilities', async () => {
    const { createFormStore } = await import('./utils/form-store');
    expect(createFormStore).toBeDefined();
    expect(typeof createFormStore).toBe('function');
  });

  it('can import query store utilities', async () => {
    const { createQueryStore } = await import('./utils/query-store');
    expect(createQueryStore).toBeDefined();
    expect(typeof createQueryStore).toBe('function');
  });

  it('can import mutation store utilities', async () => {
    const { mutationStore } = await import('./utils/mutation-store');
    expect(mutationStore).toBeDefined();
    expect(typeof mutationStore.useMutation).toBe('function');
  });
});
