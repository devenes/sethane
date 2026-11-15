/**
 * Resolves a relative asset path against Vite's configured `BASE_URL`
 * so assets work identically at `/` and on GitHub Pages (`/sethane/`).
 */
export function resolveAssetUrl(assetPath: string): string {
  if (!assetPath) {
    return '';
  }
  if (/^(https?:|data:|blob:)/i.test(assetPath)) {
    return assetPath;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanPath = assetPath.replace(/^\/+/, '');
  return `${normalizedBase}${cleanPath}`;
}
