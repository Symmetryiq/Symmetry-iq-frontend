import { COLOR, RADIUS, SPACE } from '@/constants/theme';
import { CheckCircleIcon, CircleIcon } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import ThemedText from './ThemedText';

type IconComponent = React.FC<{ size?: number; color?: string }>;

type SelectOption = {
  value: string;
  label: string;
  icon?: IconComponent | string; // Phosphor, custom SVG, or emoji string
};

type SelectProps = {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multi?: boolean;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
};

const Select = ({
  options,
  value,
  onChange,
  multi = false,
  label,
  disabled = false,
  style,
}: SelectProps) => {
  const selected = Array.isArray(value) ? value : [value];

  const handlePress = (optionValue: string) => {
    if (disabled) return;

    if (multi) {
      const next = selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue];
      onChange(next);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <ThemedText variant="body" color="onMuted" style={styles.label}>
          {label}
        </ThemedText>
      )}

      <View style={styles.list}>
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          const Icon = typeof option.icon === 'function' ? option.icon : null;
          const emoji = typeof option.icon === 'string' ? option.icon : null;

          return (
            <Pressable
              key={option.value}
              onPress={() => handlePress(option.value)}
              disabled={disabled}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed && styles.optionPressed,
                disabled && styles.optionDisabled,
              ]}
            >
              <View style={styles.content}>
                {Icon && (
                  <View style={styles.iconWrapper}>
                    <Icon
                      size={24}
                      color={isSelected ? COLOR.primaryLight : COLOR.onMuted}
                    />
                  </View>
                )}

                {emoji && <ThemedText style={styles.emoji}>{emoji}</ThemedText>}

                <ThemedText
                  variant="body"
                  color={isSelected ? 'onBackground' : 'onCard'}
                >
                  {option.label}
                </ThemedText>
              </View>

              {isSelected ? (
                <CheckCircleIcon
                  size={24}
                  color={COLOR.primary}
                  weight="fill"
                />
              ) : (
                <CircleIcon size={24} color={COLOR.onMuted} weight="regular" />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    gap: SPACE.sm,
  },
  label: {
    marginLeft: SPACE.xs,
  },
  list: {
    gap: SPACE.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.card,
    borderWidth: 1.5,
    borderColor: COLOR.borderInput,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACE.lg,
    paddingHorizontal: SPACE.lg,
    minHeight: 54,
  },
  optionSelected: {
    borderColor: 'hsla(250, 50%, 70%, 0.3)',
    backgroundColor: 'hsla(250, 50%, 70%, 0.15)',
  },
  optionPressed: {
    opacity: 0.75,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACE.md,
  },
  iconWrapper: {
    marginRight: SPACE.md,
  },
  emoji: {
    fontSize: 24,
    marginRight: SPACE.md,
  },
});
