import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowClockwiseIcon } from 'phosphor-react-native';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import { APP_NAME } from '@/constants/app';
import { COLOR, RADIUS, SPACE, TEXT } from '@/constants/theme';

/**
 * Wraps the app and replaces it with a blocking "update required" screen when
 * the remote manifest reports the installed version is below the minimum.
 *
 * Renders children immediately while the check runs in the background (the
 * check fails open), so a slow or down server never delays or blocks launch.
 */
export function ForceUpdateGate({ children }: { children: React.ReactNode }) {
  const { updateRequired, storeUrl } = useForceUpdate();

  if (!updateRequired) return <>{children}</>;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <ArrowClockwiseIcon size={36} color={COLOR.primaryLight} weight="bold" />
      </View>

      <Text style={styles.title}>Update required</Text>
      <Text style={styles.body}>
        A new version of {APP_NAME} is available with important fixes. Please
        update to keep using the app.
      </Text>

      {storeUrl ? (
        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL(storeUrl)}
        >
          <Text style={styles.buttonLabel}>Update now</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACE['2xl'],
    gap: SPACE.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACE.sm,
  },
  title: {
    ...TEXT.h3,
    color: COLOR.onBackground,
    textAlign: 'center',
  },
  body: {
    ...TEXT.body,
    color: COLOR.onMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: SPACE.md,
    backgroundColor: COLOR.primary,
    paddingVertical: SPACE.lg,
    paddingHorizontal: SPACE['3xl'],
    borderRadius: RADIUS.full,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonLabel: {
    ...TEXT.button,
    color: COLOR.onPrimary,
  },
});
