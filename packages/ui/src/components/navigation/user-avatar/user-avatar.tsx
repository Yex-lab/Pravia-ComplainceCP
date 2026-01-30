import { memo } from 'react';

import Avatar from '@mui/material/Avatar';

/**
 * Props for the UserAvatar component
 */
type UserAvatarProps = {
  /** User's display name (used for initials if firstName/lastName not provided) */
  displayName?: string;
  /** User's first name (preferred for initials) */
  firstName?: string;
  /** User's last name (preferred for initials) */
  lastName?: string;
  /** URL to user's profile photo */
  photoURL?: string;
  /** Avatar size in pixels (default: 40) */
  size?: number;
};

/**
 * Generates user initials from name fields
 * @param displayName - Full display name
 * @param firstName - First name (takes priority)
 * @param lastName - Last name (takes priority)
 * @returns Uppercase initials (1-2 characters)
 */
function getInitials(displayName?: string, firstName?: string, lastName?: string): string {
  if (firstName && lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }
  if (displayName) {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return '';
}

/**
 * UserAvatar - Displays a consistent user avatar across the application
 * 
 * Shows user's profile photo if available, otherwise displays initials on a gradient background.
 * Memoized for performance to prevent unnecessary re-renders.
 * 
 * @example
 * ```tsx
 * <UserAvatar 
 *   displayName="John Doe" 
 *   photoURL="/path/to/photo.jpg"
 *   size={100} 
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <UserAvatar 
 *   firstName="Jane" 
 *   lastName="Smith"
 *   size={40} 
 * />
 * ```
 */
export const UserAvatar = memo(({ displayName, firstName, lastName, photoURL, size = 40 }: UserAvatarProps) => {
  const initials = getInitials(displayName, firstName, lastName);
  const fontSize = size * 0.4;

  return (
    <Avatar
      src={photoURL}
      alt={firstName && lastName ? `${firstName} ${lastName}` : displayName || 'User'}
      sx={{
        width: size,
        height: size,
        fontSize: `${fontSize}px`,
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: (theme) => theme.palette.primary.darker,
        filter: 'brightness(1.15)',
        fontWeight: 'bold',
      }}
    >
      {initials}
    </Avatar>
  );
});

UserAvatar.displayName = 'UserAvatar';
