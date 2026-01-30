export const ENTITY_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9 .,'()&\-/]{1,149}$/;
export const ACRONYM_REGEX = /^[A-Z]{2,}$/;
export const ORG_CODE_REGEX = /^[A-Z0-9]{2,10}$/;
export const GOV_CODE_REGEX = /^[A-Z0-9]{2,6}$/;

// Contact validation patterns
export const NAME_REGEX = /^[A-Za-z][A-Za-z\s'-]{0,49}$/;
export const NAME_CHARS_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/; // Letters, accents, spaces, hyphens, apostrophes
export const JOB_TITLE_REGEX = /^[a-zA-Z0-9À-ÿ\s.,'&\-/()]+$/; // Letters, numbers, spaces, and common punctuation
export const ADDRESS_REGEX = /^[a-zA-Z0-9\s.,'#\-/]+$/; // Letters, numbers, spaces, and common address punctuation
export const POSTAL_CODE_REGEX = /^[0-9]{5}(-[0-9]{4})?$/; // US ZIP code: 12345 or 12345-6789
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
export const PHONE_WITH_EXT_REGEX =
  /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})(\s?(ext|x|extension)\.?\s?[0-9]{1,6})?$/i;
export const DIGITS_ONLY_REGEX = /^[0-9]+$/;

// Email sanitization
export const SANITIZED_EMAIL_DOMAIN = '.com';
