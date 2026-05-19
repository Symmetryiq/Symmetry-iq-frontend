/**
 * Get environment variable by key
 * @param key Environment variable key
 * @returns Environment variable value
 */
export function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    console.warn(`[ENV] Missing env variable: ${key}`);
    return "";
  }

  return value;
}
