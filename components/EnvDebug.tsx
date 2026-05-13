import Button from '@/components/Button';
import ScreenView from '@/components/ScreenView';
import ThemedText from '@/components/ThemedText';
import { COLOR, FONT, RADIUS, SPACE } from '@/constants/theme';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

/**
 * Temporary debug screen for confirming which EXPO_PUBLIC_* vars made it into
 * the bundle. Uses DIRECT `process.env.EXPO_PUBLIC_FOO` access — Metro inlines
 * these as string literals at build time. Wrapper access (`process.env[key]`)
 * is not reliably inlined, so this screen avoids it on purpose.
 *
 * To remove: delete this file and remove the gate in app/_layout.tsx.
 */

type EnvRow = {
  key: string;
  value: string | undefined;
  secret?: boolean;
};

const ENV_ROWS: EnvRow[] = [
  { key: 'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY', value: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY, secret: true },
  { key: 'EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID', value: process.env.EXPO_PUBLIC_CLERK_GOOGLE_WEB_CLIENT_ID },
  { key: 'EXPO_PUBLIC_CLERK_GOOGLE_ANDROID_CLIENT_ID', value: process.env.EXPO_PUBLIC_CLERK_GOOGLE_ANDROID_CLIENT_ID },
  { key: 'EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID', value: process.env.EXPO_PUBLIC_CLERK_GOOGLE_IOS_CLIENT_ID },
  { key: 'EXPO_PUBLIC_CLERK_GOOGLE_IOS_URL_SCHEME', value: process.env.EXPO_PUBLIC_CLERK_GOOGLE_IOS_URL_SCHEME },
  { key: 'EXPO_PUBLIC_SENTRY_DSN', value: process.env.EXPO_PUBLIC_SENTRY_DSN, secret: true },
  { key: 'EXPO_PUBLIC_REVENUECAT_IOS_API_KEY', value: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY, secret: true },
  { key: 'EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY', value: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY, secret: true },
  { key: 'EXPO_PUBLIC_REVENUECAT_TEST_API_KEY', value: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY, secret: true },
];

function preview(value: string | undefined, mask: boolean): string {
  if (!value) return '<empty>';
  if (!mask) return value;
  const head = value.slice(0, 10);
  return `${head}…(len ${value.length})`;
}

function activeRevenueCatKey(): { source: string; value: string | undefined } {
  if (__DEV__) {
    return {
      source: '__DEV__ → TEST_STORE',
      value: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY,
    };
  }
  if (Platform.OS === 'ios') {
    return {
      source: 'production iOS → REVENUECAT_IOS_API_KEY',
      value: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
    };
  }
  if (Platform.OS === 'android') {
    return {
      source: 'production Android → REVENUECAT_ANDROID_API_KEY',
      value: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
    };
  }
  return { source: 'unsupported platform', value: undefined };
}

type Props = { onContinue: () => void };

const EnvDebug = ({ onContinue }: Props) => {
  const [showAll, setShowAll] = useState(false);

  const presentCount = ENV_ROWS.filter((r) => !!r.value).length;
  const missingCount = ENV_ROWS.length - presentCount;
  const rcKey = activeRevenueCatKey();

  return (
    <ScreenView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator>
        <View style={styles.header}>
          <ThemedText variant="h2">Env Debug</ThemedText>
          <ThemedText color="onSecondary" variant="bodySmall">
            Values inlined by Metro into this JS bundle. Direct property access.
          </ThemedText>
        </View>

        <View style={styles.statsCard}>
          <Stat label="Platform" value={Platform.OS} />
          <Stat label="__DEV__" value={String(__DEV__)} />
          <Stat label="Channel" value={(Constants.expoConfig as any)?.updates?.channel ?? '<none>'} />
          <Stat label="Release Channel" value={(Constants as any).manifest?.releaseChannel ?? '<none>'} />
          <Stat label="App version" value={Constants.expoConfig?.version ?? '<none>'} />
          <Stat label="Present" value={`${presentCount} / ${ENV_ROWS.length}`} />
          <Stat label="Missing" value={String(missingCount)} />
        </View>

        <View style={styles.rcCard}>
          <ThemedText variant="h4">Active RevenueCat key</ThemedText>
          <Stat label="Source" value={rcKey.source} />
          <Stat label="Value" value={preview(rcKey.value, !showAll)} />
        </View>

        <Pressable style={styles.toggle} onPress={() => setShowAll((v) => !v)} hitSlop={8}>
          <ThemedText variant="label" style={styles.toggleText}>
            {showAll ? 'Hide secret values' : 'Reveal secret values'}
          </ThemedText>
        </Pressable>

        <View style={styles.list}>
          {ENV_ROWS.map((row) => {
            const present = !!row.value;
            return (
              <View key={row.key} style={[styles.row, present ? styles.rowOk : styles.rowMissing]}>
                <View style={styles.rowHeader}>
                  <ThemedText variant="label" style={styles.rowStatus}>
                    {present ? 'OK' : 'MISSING'}
                  </ThemedText>
                  <ThemedText variant="bodySmall" style={styles.rowKey}>
                    {row.key}
                  </ThemedText>
                </View>
                <ThemedText variant="caption" color="onSecondary" style={styles.rowValue}>
                  {preview(row.value, row.secret === true && !showAll)}
                </ThemedText>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Button title="Continue to App" variant="primary" onPress={onContinue} />
        </View>
      </ScrollView>
    </ScreenView>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <ThemedText variant="caption" color="onMuted" style={styles.statLabel}>
        {label}
      </ThemedText>
      <ThemedText variant="bodySmall" style={styles.statValue} numberOfLines={2}>
        {value}
      </ThemedText>
    </View>
  );
}

export default EnvDebug;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { gap: SPACE.lg, paddingBottom: SPACE['3xl'] },

  header: { gap: 4 },

  statsCard: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLOR.border,
    padding: SPACE.md,
    gap: SPACE.xs,
  },

  rcCard: {
    backgroundColor: COLOR.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLOR.border,
    padding: SPACE.md,
    gap: SPACE.xs,
  },

  statRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACE.md },
  statLabel: { flexShrink: 0 },
  statValue: { flex: 1, textAlign: 'right', fontFamily: FONT.medium },

  toggle: { alignSelf: 'flex-start' },
  toggleText: { color: COLOR.primaryLight, textDecorationLine: 'underline' },

  list: { gap: SPACE.sm },

  row: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACE.md,
    gap: 4,
  },
  rowOk: { borderColor: COLOR.border, backgroundColor: COLOR.card },
  rowMissing: { borderColor: COLOR.red, backgroundColor: 'rgba(239, 68, 68, 0.08)' },

  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACE.sm },
  rowStatus: { fontFamily: FONT.bold, width: 64 },
  rowKey: { flex: 1, fontFamily: FONT.medium },
  rowValue: { fontFamily: FONT.medium },

  footer: { paddingTop: SPACE.md },
});
