import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, RADIUS, SPACE } from '@/constants/theme';
import {
  NotificationItem,
  useNotificationStore,
} from '@/hooks/useNotificationStore';
import {
  registerForPushNotificationsAsync,
  sendRemoteTestPush,
  triggerLocalTestNotification,
} from '@/utils/notification.util';
import {
  BellIcon,
  CheckIcon,
  PaperPlaneTiltIcon,
  TrashIcon,
} from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

function formatTime(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.round(diff / 60_000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString();
}

function NotificationRow({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.rowLeft}>
        {!item.read && <View style={styles.unreadDot} />}
        <BellIcon
          size={20}
          color={item.read ? COLOR.onMuted : COLOR.primaryLight}
          weight={item.read ? 'regular' : 'fill'}
        />
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowHeader}>
          <ThemedText
            variant="body"
            style={[styles.rowTitle, !item.read && styles.rowTitleUnread]}
            numberOfLines={1}
          >
            {item.title}
          </ThemedText>
          <ThemedText variant="caption" color="onMuted">
            {formatTime(item.receivedAt)}
          </ThemedText>
        </View>
        {!!item.body && (
          <ThemedText
            variant="bodySmall"
            color="onSecondary"
            numberOfLines={2}
            style={styles.rowText}
          >
            {item.body}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const NotificationsScreen = () => {
  const items = useNotificationStore((s) => s.items);
  const pushToken = useNotificationStore((s) => s.pushToken);
  const setPushToken = useNotificationStore((s) => s.setPushToken);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const [testingLocal, setTestingLocal] = useState(false);
  const [testingRemote, setTestingRemote] = useState(false);
  const [requestingToken, setRequestingToken] = useState(false);

  const handleLocalTest = useCallback(async () => {
    setTestingLocal(true);
    try {
      await triggerLocalTestNotification();
      Alert.alert(
        'Test scheduled',
        'A local notification will appear in ~2 seconds. Background the app or stay foregrounded — the handler will surface it either way.',
      );
    } catch {
      Alert.alert('Failed', 'Could not schedule a local test notification.');
    } finally {
      setTestingLocal(false);
    }
  }, []);

  const handleRemoteTest = useCallback(async () => {
    if (!pushToken) {
      Alert.alert(
        'No push token',
        'Tap "Request push permission" first. Remote pushes only work on a physical device with notifications allowed.',
      );
      return;
    }
    setTestingRemote(true);
    try {
      await sendRemoteTestPush(pushToken);
      Alert.alert(
        'Sent',
        'Expo should deliver the push within a few seconds.',
      );
    } catch {
      Alert.alert('Failed', 'Could not reach the Expo push service.');
    } finally {
      setTestingRemote(false);
    }
  }, [pushToken]);

  const handleRequestToken = useCallback(async () => {
    setRequestingToken(true);
    const token = await registerForPushNotificationsAsync();
    setPushToken(token);
    setRequestingToken(false);

    if (!token) {
      Alert.alert(
        'No token',
        'Notifications were denied or you are on a simulator. Local tests still work; remote pushes require a physical device with permission granted.',
      );
    }
  }, [setPushToken]);

  const handleCopyTokenHint = useCallback(() => {
    if (!pushToken) return;
    Alert.alert(
      'Push token',
      `${pushToken}\n\nLong-press the token text to select and copy it. Paste into https://expo.dev/notifications to send a push from your browser.`,
    );
  }, [pushToken]);

  const handleClearAll = useCallback(() => {
    if (items.length === 0) return;
    Alert.alert(
      'Clear notifications?',
      'This removes all notifications from this device only.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearAll },
      ],
    );
  }, [items.length, clearAll]);

  const renderEmpty = () => (
    <View style={styles.empty}>
      <BellIcon size={32} color={COLOR.onMuted} />
      <ThemedText variant="h4">No notifications yet</ThemedText>
      <ThemedText
        variant="bodySmall"
        color="onSecondary"
        style={styles.emptyText}
      >
        Use the test buttons above to send yourself a notification and confirm
        delivery on this device.
      </ThemedText>
    </View>
  );

  return (
    <ScreenView style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h2">Notifications</ThemedText>
        {items.length > 0 && (
          <Pressable onPress={markAllRead} hitSlop={8}>
            <ThemedText variant="bodySmall" color="primaryLight">
              Mark all read
            </ThemedText>
          </Pressable>
        )}
      </View>

      <View style={styles.testCard}>
        <ThemedText variant="h5">Test delivery</ThemedText>
        <ThemedText variant="bodySmall" color="onSecondary">
          {pushToken
            ? 'Permission granted. You can fire a local notification or send a remote push to this device.'
            : 'Request permission to enable remote pushes. Local tests work without a token.'}
        </ThemedText>

        <View style={styles.testRow}>
          <Button
            title="Local test"
            variant="primary"
            size="sm"
            icon={BellIcon}
            onPress={handleLocalTest}
            loading={testingLocal}
            fullWidth
          />
          <Button
            title="Remote test"
            variant="secondary"
            size="sm"
            icon={PaperPlaneTiltIcon}
            onPress={handleRemoteTest}
            loading={testingRemote}
            disabled={!pushToken}
            fullWidth
          />
        </View>

        <Button
          title={
            pushToken ? 'View / copy push token' : 'Request push permission'
          }
          variant="ghost"
          size="sm"
          onPress={pushToken ? handleCopyTokenHint : handleRequestToken}
          loading={requestingToken}
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationRow item={item} onPress={() => markRead(item.id)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          items.length === 0 ? styles.listEmptyContent : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <Button
            title="Mark all read"
            variant="ghost"
            size="sm"
            icon={CheckIcon}
            onPress={markAllRead}
            fullWidth
          />
          <Button
            title="Clear all"
            variant="ghost"
            size="sm"
            icon={TrashIcon}
            onPress={handleClearAll}
            fullWidth
          />
        </View>
      )}
    </ScreenView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    gap: SPACE.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testCard: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS.xl,
    padding: SPACE.lg,
    gap: SPACE.sm,
  },
  testRow: {
    flexDirection: 'row',
    gap: SPACE.sm,
  },
  separator: {
    height: 1,
    backgroundColor: COLOR.border,
    marginLeft: 44,
  },
  listContent: {
    paddingBottom: SPACE.xl,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACE.md,
    paddingVertical: SPACE.md,
  },
  rowLeft: {
    width: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.primaryLight,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: SPACE.sm,
  },
  rowTitle: {
    flex: 1,
  },
  rowTitleUnread: {
    color: COLOR.onBackground,
    fontWeight: '600',
  },
  rowText: {
    lineHeight: 20,
  },
  empty: {
    alignItems: 'center',
    gap: SPACE.sm,
    padding: SPACE.xl,
  },
  emptyText: {
    textAlign: 'center',
    maxWidth: 280,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACE.sm,
    paddingTop: SPACE.sm,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
  },
});
