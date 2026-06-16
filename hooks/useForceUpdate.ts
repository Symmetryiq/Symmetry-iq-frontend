import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { VERSION_MANIFEST_URL } from '@/constants/app';

type PlatformManifest = {
  minVersion?: string;
  storeUrl?: string;
};

type VersionManifest = {
  ios?: PlatformManifest;
  android?: PlatformManifest;
};

export type ForceUpdateState = {
  /** True once the remote check has finished (whether it succeeded or failed open). */
  checked: boolean;
  /** True when the installed version is below the remote minimum. */
  updateRequired: boolean;
  /** Store URL to send the user to, taken from the manifest. */
  storeUrl: string | null;
};

const FETCH_TIMEOUT_MS = 6000;

/**
 * Compares two dotted version strings (e.g. "1.2.0").
 * Returns a negative number if a < b, 0 if equal, positive if a > b.
 */
function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/**
 * Checks a remote manifest on launch and reports whether the installed build is
 * below the minimum supported version, so the app can show a blocking
 * update screen for critical native bugs that OTA updates can't fix.
 *
 * Fails OPEN: any network/parse error or timeout leaves the app fully usable.
 * We never lock users out because our server is unreachable — that is the exact
 * failure mode that previously broke the in-app privacy link.
 */
export function useForceUpdate(): ForceUpdateState {
  const [state, setState] = useState<ForceUpdateState>({
    checked: false,
    updateRequired: false,
    storeUrl: null,
  });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    (async () => {
      try {
        const res = await fetch(VERSION_MANIFEST_URL, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`Manifest HTTP ${res.status}`);

        const manifest: VersionManifest = await res.json();
        const platform =
          Platform.OS === 'ios' ? manifest.ios : manifest.android;
        const current = Application.nativeApplicationVersion ?? '0.0.0';

        const updateRequired =
          !!platform?.minVersion &&
          compareVersions(current, platform.minVersion) < 0;

        if (!cancelled) {
          setState({
            checked: true,
            updateRequired,
            storeUrl: platform?.storeUrl ?? null,
          });
        }
      } catch {
        // Fail open — keep the app usable when the manifest can't be read.
        if (!cancelled) {
          setState({ checked: true, updateRequired: false, storeUrl: null });
        }
      } finally {
        clearTimeout(timeout);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return state;
}
