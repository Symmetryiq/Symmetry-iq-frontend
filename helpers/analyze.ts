import * as SecureStorage from 'expo-secure-store';

const JWT_STORAGE_KEY = 'face_scoring_jwt_token';

/**
 * Decodes a JWT token payload.
 * @param token JWT string
 * @returns payload object or null
 */
function decodeJWTPayload(token: string): { iat: number; date: string } | null {
  try {
    const payloadPart = token.split('.')[1];
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Checks if the JWT token is still valid (not expired).
 * JWTs are valid for 24 hours from 'iat'
 * @param token JWT string
 */
function isJWTValid(token: string): boolean {
  const payload = decodeJWTPayload(token);
  if (!payload || typeof payload.iat !== 'number') return false;
  const nowSec = Math.floor(Date.now() / 1000);
  // 24 hours = 86400 seconds
  return nowSec < payload.iat + 86400;
}

/**
 * Stores the JWT token in persistent storage.
 */
async function saveJWTToken(token: string) {
  await SecureStorage.setItem(JWT_STORAGE_KEY, token);
}

/**
 * Loads the JWT token from persistent storage.
 */
async function loadJWTToken(): Promise<string | null> {
  return SecureStorage.getItem(JWT_STORAGE_KEY);
}

/**
 * Fetches a new JWT token from the API.
 */
async function fetchJWTToken(): Promise<string> {
  const resp = await fetch('https://face-scoring.vercel.app/jwt');
  if (!resp.ok) throw new Error('Unable to fetch JWT token');
  const data = await resp.json();
  if (!data || typeof data.jwt !== 'string')
    throw new Error('Invalid JWT response');
  return data.jwt;
}

/**
 * Retrieves a valid JWT token, refreshing if needed.
 */
export async function getValidJWTToken(): Promise<string> {
  let token = await loadJWTToken();
  if (token && isJWTValid(token)) return token;
  token = await fetchJWTToken();
  await saveJWTToken(token);
  return token;
}

export const getColorByScore = (value: number, isReversed: boolean = false) => {
  const adjustedValue = isReversed ? 100 - value : value;
  if (adjustedValue >= 75) return '#22C55E'; // green
  if (adjustedValue >= 55) return '#F59E0B'; // yellow
  return '#EF4444'; // red
};

export const getLabelByScore = (value: number, isReversed: boolean = false) => {
  const adjustedValue = isReversed ? 100 - value : value;
  if (adjustedValue >= 75) return 'Excellent';
  if (adjustedValue >= 55) return 'Good';
  return 'Needs Improvement';
};
