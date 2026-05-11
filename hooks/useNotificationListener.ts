import { registerForPushNotificationsAsync } from '@/utils/notification.util';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { useNotificationStore } from './useNotificationStore';

function toItem(notification: Notifications.Notification) {
  const request = notification.request;
  const content = request.content;
  return {
    id: request.identifier,
    title: content.title ?? 'Notification',
    body: content.body ?? '',
    data: (content.data as Record<string, unknown>) ?? {},
    receivedAt: new Date(notification.date).toISOString(),
  };
}

/**
 * Bootstraps the notification system once the user is signed in:
 * - requests permissions and persists the resulting Expo push token
 * - subscribes to received + tap-response listeners
 * - records every received notification in the store
 * - on tap, marks the item read and (optionally) routes via data.route
 */
export function useNotificationListener() {
  const addItem = useNotificationStore((s) => s.addItem);
  const markRead = useNotificationStore((s) => s.markRead);
  const setPushToken = useNotificationStore((s) => s.setPushToken);

  useEffect(() => {
    let cancelled = false;

    registerForPushNotificationsAsync().then((token) => {
      if (cancelled) return;
      setPushToken(token);
    });

    const receivedSub = Notifications.addNotificationReceivedListener(
      (notification) => addItem(toItem(notification)),
    );

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const item = toItem(response.notification);
        addItem(item);
        markRead(item.id);

        const route = item.data?.route;
        if (typeof route === 'string' && route.startsWith('/')) {
          router.push(route as never);
        }
      },
    );

    return () => {
      cancelled = true;
      receivedSub.remove();
      responseSub.remove();
    };
  }, [addItem, markRead, setPushToken]);
}
