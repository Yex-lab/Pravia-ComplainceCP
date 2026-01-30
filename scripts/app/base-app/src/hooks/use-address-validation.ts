import { useState } from 'react';

type ValidationResult = {
  isValid: boolean;
  message?: string;
};

export function useAddressValidation() {
  const [validating, setValidating] = useState(false);

  const validate = async (address: {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
  }): Promise<ValidationResult> => {
    setValidating(true);

    try {
      // TODO: Replace with real backend API call
      // const response = await fetch('/api/address/validate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(address),
      // });
      // const data = await response.json();
      // return { isValid: data.isValid, message: data.message };

      // Mock validation - simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock validation logic
      if (!address.addressLine1 || !address.city || !address.state || !address.zip) {
        return { isValid: false, message: 'All address fields are required.' };
      }

      if (address.zip.length !== 5) {
        return { isValid: false, message: 'ZIP code must be 5 digits.' };
      }

      // Mock: addresses starting with "999" are invalid
      if (address.addressLine1.startsWith('999')) {
        return {
          isValid: false,
          message: 'Address could not be verified. Please check and try again.',
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        message: 'Unable to validate address. Please try again.',
      };
    } finally {
      setValidating(false);
    }
  };

  return { validate, validating };
}
