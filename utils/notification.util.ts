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
