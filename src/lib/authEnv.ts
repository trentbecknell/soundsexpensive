export interface AuthFlags {
  FORCE_ANON: boolean;
  ENABLE_CLERK: boolean;
}

/**
 * Compute authentication flags in a pure, testable way.
 *
 * Inputs:
 * - host: window.location.host (e.g., 'user.github.io')
 * - isProdBuild: import.meta.env.PROD
 * - hasClerkKey: Boolean(VITE_CLERK_PUBLISHABLE_KEY)
 * - runtimeAnonFlag: whether anon=1 or persisted flag forces anon
 */
export function computeAuthFlags(
  host: string,
  isProdBuild: boolean,
  hasClerkKey: boolean,
  runtimeAnonFlag: boolean
): AuthFlags {
  const ON_PUBLIC_HOST = /github\.io|netlify\.app|vercel\.app/i.test(host || '');
  const FORCE_ANON = Boolean(runtimeAnonFlag || isProdBuild || ON_PUBLIC_HOST);
  const ENABLE_CLERK = Boolean(hasClerkKey && !FORCE_ANON && !isProdBuild);
  return { FORCE_ANON, ENABLE_CLERK };
}

export default computeAuthFlags;
