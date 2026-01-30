import { useState, useCallback } from 'react';

type AddressResult = {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  displayText: string;
};

// Mock data for testing - replace with real API call via backend proxy
const mockAddresses: Record<string, AddressResult[]> = {
  '403': [
    {
      streetAddress: '4030 Tebti Way',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95834',
      displayText: '4030 Tebti Way, Sacramento, CA 95834',
    },
  ],
  '123': [
    {
      streetAddress: '1234 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      displayText: '1234 Main St, Los Angeles, CA 90001',
    },
    {
      streetAddress: '1235 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      displayText: '1235 Main St, Los Angeles, CA 90001',
    },
  ],
};

export function useAddressSearch() {
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      // Mock search - find matching addresses
      const searchKey = Object.keys(mockAddresses).find((key) =>
        query.toLowerCase().startsWith(key)
      );

      if (searchKey) {
        setResults(mockAddresses[searchKey]);
      } else {
        setResults([]);
      }

      // TODO: Replace with real backend API call
      // const response = await fetch('/api/address/search', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ query }),
      // });
      // const data = await response.json();
      // setResults(data.addresses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
