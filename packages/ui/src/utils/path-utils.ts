// ----------------------------------------------------------------------

export function isExternalLink(path: string): boolean {
  return path.includes('http') || path.includes('https');
}

// ----------------------------------------------------------------------

export function isActiveLink(pathname: string, path: string, deep = false): boolean {
  // Handle null/undefined values
  if (!pathname || !path) {
    return false;
  }

  // Normalize both paths to have trailing slashes (unless it's just '/')
  const normalizedPath = path === '/' ? path : path.endsWith('/') ? path : `${path}/`;
  const normalizedPathname = pathname === '/' ? pathname : pathname.endsWith('/') ? pathname : `${pathname}/`;

  if (deep) {
    return normalizedPathname.startsWith(normalizedPath);
  }

  return normalizedPathname === normalizedPath;
}
