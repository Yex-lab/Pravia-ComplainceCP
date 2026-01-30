import { useQuery } from '@tanstack/react-query';

import { contactsService, type ContactStatusDto } from 'src/services/contacts.service';

export { contactsService };

export function useContactStatus(email: string, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: ['contact-status', email],
    queryFn: async () => {
      console.log(`Starting query for: ${email}`);
      try {
        const result = await contactsService.getContactStatus(email);
        console.log(`Success for ${email}:`, result);
        return result;
      } catch (error) {
        console.error(`Error for ${email}:`, error);
        throw error;
      }
    },
    enabled: !!email && options?.enabled !== false,
    staleTime: 5 * 60 * 1000,
    retry: 1, // Only retry once
  });
  return query;
}

export function useBulkContactStatus(emails: string[]) {
  return useQuery({
    queryKey: ['bulk-contact-status', emails.sort().join(',')], // Sort emails for consistent cache key
    queryFn: () => {
      console.log(`🔄 Starting bulk status query for ${emails.length} emails`);
      return contactsService.getBulkContactStatus(emails); // Use the corrected bulk method
    },
    enabled: emails.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes - longer cache
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
    retry: 1,
  });
}

export function mapContactStatus(status: ContactStatusDto['status']): {
  label: string;
  color: 'default' | 'warning' | 'info' | 'error';
} {
  const statusMap = {
    not_registered: { label: 'Not Registered', color: 'default' as const },
    pending: { label: 'Pending', color: 'warning' as const },
    confirmed: { label: 'Registered', color: 'info' as const },
  };

  return statusMap[status] || statusMap.not_registered;
}
