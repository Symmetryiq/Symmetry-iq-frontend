import ScreenWrapper from '@/components/common/screen-wrapper';
import Typography from '@/components/common/typography';
import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { Notification } from '@/services/api/notification.api';
import { useNotificationStore } from '@/stores/notification-store';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeft, BellSimple, CheckCircle } from 'phosphor-react-native';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

const NotificationItem = ({
  notification,
  onPress,
}: {
  notification: Notification;
  onPress: () => void;
}) => {
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <Pressable
      style={[
        styles.notificationItem,
        !notification.read && styles.notificationItemUnread,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          !notification.read && styles.iconContainerUnread,
        ]}
      >
        <BellSimple
          size={20}
          color={notification.read ? Colors.onMuted : Colors.primary}
          weight={notification.read ? 'regular' : 'fill'}
        />
      </View>

      <View style={styles.notificationContent}>
        <Typography
          font={notification.read ? 'regular' : 'semiBold'}
          size={16}
          color={notification.read ? 'onSecondary' : 'onBackground'}
          textProps={{ numberOfLines: 1 }}
        >
          {notification.title}
        </Typography>
        <Typography
          size={14}
          color="onMuted"
          textProps={{ numberOfLines: 2 }}
          style={{ marginTop: 2 }}
        >
          {notification.body}
        </Typography>
        <Typography size={12} color="onMuted" style={{ marginTop: 6 }}>
          {timeAgo}
        </Typography>
      </View>

      {!notification.read && <View style={styles.unreadDot} />}
    </Pressable>
  );
};

const EmptyState = () => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIconContainer}>
      <BellSimple size={48} color={Colors.onMuted} weight="light" />
    </View>
    <Typography font="semiBold" size={20} color="onSecondary" style={{ marginTop: 16 }}>
      No notifications yet
    </Typography>
    <Typography size={14} color="onMuted" style={{ marginTop: 8, textAlign: 'center' }}>
      When you receive notifications, they'll appear here
    </Typography>
  </View>
);

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(true);
    }, [])
  );

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }

    // Navigate based on notification data if needed
    if (notification.data?.route) {
      router.push(notification.data.route as any);
    }
  };

  const handleRefresh = () => {
    fetchNotifications(true);
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
    />
  );

  return (
    <ScreenWrapper edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.onBackground} />
        </Pressable>

        <Typography font="semiBold" size={20} color="onBackground">
          Notifications
        </Typography>

        {unreadCount > 0 && (
          <Pressable style={styles.markAllButton} onPress={markAllAsRead}>
            <CheckCircle size={20} color={Colors.primary} />
          </Pressable>
        )}

        {unreadCount === 0 && <View style={{ width: 40 }} />}
      </View>

      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            notifications.length === 0 && styles.listContentEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={EmptyState}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </ScreenWrapper>
  );
};

export default Notifications;

// Helper function to format relative time
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  backButton: {
    padding: 8,
    marginLeft: -8,
  },

  markAllButton: {
    padding: 8,
    marginRight: -8,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContent: {
    padding: scale(16),
  },

  listContentEmpty: {
    flex: 1,
  },

  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: scale(16),
    backgroundColor: Colors.card,
    borderRadius: 16,
  },

  notificationItemUnread: {
    backgroundColor: Colors.primaryLight,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },

  iconContainerUnread: {
    backgroundColor: 'hsla(250, 50%, 50%, 0.3)',
  },

  notificationContent: {
    flex: 1,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: scale(8),
    marginTop: 6,
  },

  separator: {
    height: verticalScale(8),
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(32),
  },

  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
});