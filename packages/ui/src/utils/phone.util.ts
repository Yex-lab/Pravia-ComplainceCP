/**
 * Format phone number for display: (916) 333-4567 or (916) 333-4567 x12345
 * Input format: "9163334567" or "9163334567 12345"
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';

  // Split by space to separate number and extension
  const parts = phone.trim().split(/\s+/);
  const digits = parts[0].replace(/\D/g, '');
  const extension = parts[1];

  // Handle 10-digit US numbers
  if (digits.length === 10) {
    const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    return extension ? `${formatted} x${extension}` : formatted;
  }

  // Handle 11-digit with country code (remove leading 1)
  if (digits.length === 11 && digits[0] === '1') {
    const formatted = `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return extension ? `${formatted} x${extension}` : formatted;
  }

  // Return as-is if not standard format
  return phone;
}

/**
 * Convert from storage format to E.164 for PhoneInput component
 * Input: "9163334567" or "9163334567 12345"
 * Output: "+19163334567"
 */
export function storageToE164(phone: string | null | undefined): string {
  if (!phone) return '';

  // Split by space to get just the main number (ignore extension for input)
  const parts = phone.trim().split(/\s+/);
  const digits = parts[0].replace(/\D/g, '');

  // Add +1 country code for 10-digit numbers
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // Already has country code
  if (digits.length === 11 && digits[0] === '1') {
    return `+${digits}`;
  }

  return phone;
}

/**
 * Convert from E.164 to storage format
 * Input: "+19163334567"
 * Output: "9163334567"
 */
export function formatPhoneToE164(phone: string | null | undefined): string {
  if (!phone) return '';

  // Extract extension if present (after 'x' or as separate number group)
  const extensionMatch = phone.match(/(?:x|ext\.?)\s*(\d+)/i);
  const extension = extensionMatch ? extensionMatch[1] : '';

  // Remove all non-numeric characters except spaces
  const cleaned = phone.replace(/[^\d\s]/g, '');
  const parts = cleaned.trim().split(/\s+/);
  const digits = parts[0];

  // Handle 10-digit US numbers
  if (digits.length === 10) {
    return extension ? `${digits} ${extension}` : digits;
  }

  // Handle 11-digit with country code (remove leading 1)
  if (digits.length === 11 && digits[0] === '1') {
    const tenDigits = digits.slice(1);
    return extension ? `${tenDigits} ${extension}` : tenDigits;
  }

  // If already in correct format with extension
  if (digits.length === 10 && parts[1]) {
    return `${digits} ${parts[1]}`;
  }

  return phone;
}

/**
 * Parse phone number from any format to digits only
 */
export function parsePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Format phone input as user types: (555) 555-5555
 */
export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 10);
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return value;
  return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
}

/**
 * Format business phone with extension as user types: (555) 555-5555 12345
 */
export function formatBusinessPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const phone = cleaned.slice(0, 10);
  const ext = cleaned.slice(10, 15);
  const match = phone.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return value;
  const formatted = !match[2]
    ? match[1]
    : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  return ext ? `${formatted} ${ext}` : formatted;
}

/**
 * Parse business phone into phone and extension for storage
 * Input: "(555) 555-5555 12345" or "5555555555 12345"
 * Output: { phone: "5555555555", extension: "12345" }
 */
export function parseBusinessPhone(businessPhone?: string): {
  phone: string | undefined;
  extension: string | undefined;
} {
  if (!businessPhone) return { phone: undefined, extension: undefined };

  const cleaned = businessPhone.replace(/\D/g, '');
  const phone = cleaned.slice(0, 10);
  const extension = cleaned.slice(10, 15) || undefined;

  return {
    phone: phone || undefined,
    extension,
  };
}

/**
 * Parse regular phone (no extension) for storage
 * Input: "(555) 555-5555" or "5555555555"
 * Output: "5555555555"
 */
export function parsePhone(phone?: string): string | undefined {
  if (!phone) return undefined;

  const cleaned = phone.replace(/\D/g, '').slice(0, 10);
  return cleaned || undefined;
}
