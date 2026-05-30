import { ScanRecord, toDateKey } from '@/hooks/useScanStore';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

/**
 * Requests permission and returns an Expo push token.
 * Returns null on simulator, denial, or any failure — never throws.
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  await ensureAndroidChannel();

  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) return null;

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch {
    return null;
  }
}

/**
 * Schedules a local notification that fires after a short delay,
 * letting the user verify permissions, the handler, and listeners.
 */
export async function triggerLocalTestNotification(
  payload: NotificationPayload = {
    title: 'Test notification',
    body: 'Push notifications are working.',
    data: { source: 'local-test' },
  },
  delaySeconds = 2,
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      sound: 'default',
    },
    trigger:
      delaySeconds > 0
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: delaySeconds,
          }
        : null,
  });
}

/**
 * Sends a remote push via Expo's push API. Useful for testing token delivery
 * end-to-end from inside the app.
 */
export async function sendRemoteTestPush(
  expoPushToken: string,
  payload: NotificationPayload = {
    title: 'Remote test',
    body: 'Sent through the Expo push service.',
    data: { source: 'remote-test' },
  },
): Promise<void> {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
    }),
  });
}

/* ─── Local scheduled reminders ─────────────────────────────────────────── */

const REMINDER_PREFIX = 'sym.reminder.';
const REMINDER_HOUR = 19; // 7pm local
const REMINDER_MINUTE = 0;
const INACTIVITY_DAYS = 3;

function nextOccurrence(
  hour: number,
  minute: number,
  fromDate: Date = new Date(),
): Date {
  const target = new Date(fromDate);
  target.setHours(hour, minute, 0, 0);
  if (target.getTime() <= fromDate.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

async function cancelOurScheduledReminders(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(REMINDER_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

/**
 * Re-evaluates the user's scan state and (re)schedules local reminders.
 * Safe to call on every app foreground and whenever scan history changes.
 *
 * Schedules up to two notifications:
 *   1. Daily scan reminder — fires at the next 7pm local time with copy that
 *      adapts based on whether they've already scanned today.
 *   2. Inactivity nudge — fires 3 days after the last scan if they don't
 *      open the app again first.
 */
export async function rescheduleScanReminders(
  history: ScanRecord[],
): Promise<void> {
  try {
    await ensureAndroidChannel();

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    await cancelOurScheduledReminders();

    const now = new Date();
    const lastScanAt = history[0]?.createdAt
      ? new Date(history[0].createdAt)
      : null;
    const scannedToday =
      lastScanAt !== null && toDateKey(lastScanAt) === toDateKey(now);

    // Daily reminder — content depends on state, timing is always next 7pm.
    const dailyFireAt = nextOccurrence(REMINDER_HOUR, REMINDER_MINUTE, now);
    let title: string;
    let body: string;
    if (!lastScanAt) {
      title = 'Ready for your first scan?';
      body = 'Take 10 seconds to capture your baseline.';
    } else if (scannedToday) {
      title = 'Streak in motion';
      body = "See you tomorrow for the next scan — keep it going.";
    } else {
      title = "Today's scan is waiting";
      body = 'Keep your streak alive — it only takes 10 seconds.';
    }

    await Notifications.scheduleNotificationAsync({
      identifier: `${REMINDER_PREFIX}scan-daily`,
      content: {
        title,
        body,
        data: { source: 'scan-reminder', route: '/(app)/(tabs)/scan' },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dailyFireAt,
      },
    });

    // Inactivity nudge — only meaningful if we have at least one prior scan.
    if (lastScanAt) {
      const inactivityFireAt = new Date(lastScanAt);
      inactivityFireAt.setDate(
        inactivityFireAt.getDate() + INACTIVITY_DAYS,
      );
      inactivityFireAt.setHours(REMINDER_HOUR, REMINDER_MINUTE, 0, 0);

      // Only schedule if it's far enough in the future to not collide with
      // the daily reminder.
      const minLeadMs = 60 * 60 * 1000; // 1 hour
      if (inactivityFireAt.getTime() > now.getTime() + minLeadMs) {
        await Notifications.scheduleNotificationAsync({
          identifier: `${REMINDER_PREFIX}scan-inactivity`,
          content: {
            title: 'We miss you',
            body: "It's been a few days — pick up where you left off.",
            data: {
              source: 'inactivity-reminder',
              route: '/(app)/(tabs)/scan',
            },
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: inactivityFireAt,
          },
        });
      }
    }
  } catch (e) {
    Sentry.captureException(e);
  }
}
