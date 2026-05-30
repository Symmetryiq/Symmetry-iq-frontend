import { rescheduleScanReminders } from '@/utils/notification.util';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useScanStore } from './useScanStore';

/**
 * Keeps local scan reminders in sync with the user's scan history.
 *
 * Reschedules whenever:
 *   - the hook mounts (entering the main app),
 *   - scan history changes (a new scan, or a wipe via account delete),
 *   - the app returns to the foreground (so the daily slot shifts forward).
 *
 * No-ops silently if notification permission has not been granted —
 * permission is requested separately by useNotificationListener at the root.
 */
export function useScheduledReminders() {
  const history = useScanStore((s) => s.history);

  useEffect(() => {
    void rescheduleScanReminders(history);
  }, [history]);

  useEffect(() => {
    const sub = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') {
          void rescheduleScanReminders(useScanStore.getState().history);
        }
      },
    );
    return () => sub.remove();
  }, []);
}
