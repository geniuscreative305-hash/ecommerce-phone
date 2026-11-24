/**
 * Centralized Admin Path Helper
 * Reads NEXT_PUBLIC_ADMIN_PATH (e.g. '/jc-control-99x') from env or falls back to '/admin'
 */
export function getAdminPath(subpath: string = ''): string {
  const base = process.env.NEXT_PUBLIC_ADMIN_PATH || '/admin';
  const cleanBase = base.startsWith('/') ? base : `/${base}`;
  if (!subpath) return cleanBase;
  const cleanSub = subpath.startsWith('/') ? subpath : `/${subpath}`;
  return `${cleanBase}${cleanSub}`;
}

