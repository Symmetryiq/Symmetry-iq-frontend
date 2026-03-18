import { Animation, Colors, Radii, Shadows, Spacing } from '@/constants/theme';
import { moderateScale } from '@/helpers/scaling';
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  SlideInUp,
  SlideOutUp
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';

// ─── Types ──────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

// ─── Context ────────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue>({
  show: () => { },
});

/** Hook to trigger toasts from anywhere in the tree */
export function useToast() {
  return useContext(ToastContext);
}

// ─── Color map ──────────────────────────────────────────────────────────────────
const typeColors: Record<ToastType, string> = {
  success: Colors.success,
  error: Colors.danger,
  warning: Colors.warning,
  info: Colors.info,
};

const typeBgColors: Record<ToastType, string> = {
  success: Colors.successLight,
  error: Colors.dangerLight,
  warning: Colors.warningLight,
  info: Colors.infoLight,
};

// ─── Toast Item Component ───────────────────────────────────────────────────────
function ToastItemView({ item }: { item: ToastItem }) {
  return (
    <Animated.View
      entering={SlideInUp.duration(Animation.duration.normal)}
      exiting={SlideOutUp.duration(Animation.duration.normal)}
      style={[
        styles.toast,
        {
          backgroundColor: typeBgColors[item.type],
          borderLeftColor: typeColors[item.type],
        },
      ]}
    >
      <Text variant="subtitle2" color={Colors.onBackground} numberOfLines={2}>
        {item.message}
      </Text>
    </Animated.View>
  );
}

// ─── Provider ───────────────────────────────────────────────────────────────────
const AUTO_DISMISS_MS = 3000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();
  const counterRef = useRef(0);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${++counterRef.current}`;
    const newToast: ToastItem = { id, message, type };

    setToasts((prev) => [newToast, ...prev.slice(0, 2)]); // max 3 visible

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, AUTO_DISMISS_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View
        style={[styles.container, { top: insets.top + Spacing.sm }]}
        pointerEvents="none"
      >
        {toasts.map((item) => (
          <ToastItemView key={item.id} item={item} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 9999,
    gap: Spacing.sm,
  },
  toast: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    borderLeftWidth: moderateScale(4),
    ...Shadows.md,
  },
});
