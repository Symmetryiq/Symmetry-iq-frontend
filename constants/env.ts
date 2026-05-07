import { getEnv } from '@/utils/env.util';

export const API_URL = getEnv('EXPO_PUBLIC_API_URL');
export const SENTRY_DSN = getEnv('EXPO_PUBLIC_SENTRY_DSN');
export const CLERK_PUBLISHABLE_KEY = getEnv(
  'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY',
);
