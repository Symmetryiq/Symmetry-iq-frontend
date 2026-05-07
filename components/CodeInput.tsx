import { COLOR, SHADOW, TEXT } from '@/constants/theme';
import { moderateScale, moderateVerticalScale } from '@/utils/scaling.util';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';
import ThemedText from './ThemedText';

type CodeInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  onResendOTP?: () => void;
};

const CodeInput = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  onResendOTP,
}: CodeInputProps) => {
  const inputRefs = useRef<TextInput[]>([]);
  const animatedValues = useRef<Animated.Value[]>([]);
  const [countdown, setCountdown] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);

  useEffect(() => {
    animatedValues.current = Array(length)
      .fill(0)
      .map(() => new Animated.Value(0));
  }, [length]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0 && !isResendActive) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendActive(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, isResendActive]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();

      Animated.sequence([
        Animated.timing(animatedValues.current[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.current[index], {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleResendOTP = () => {
    if (isResendActive && onResendOTP) {
      onResendOTP();
      setCountdown(60);
      setIsResendActive(false);

      setTimeout(() => {
        focusInput(0);
      }, 50);
    }
  };

  const handleChange = (text: string, index: number) => {
    const newValue = [...value];
    newValue[index] = text;
    onChange(newValue);

    if (text && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        {Array(length)
          .fill(0)
          .map((_, index) => {
            const animatedStyle = {
              transform: [
                {
                  scale:
                    animatedValues.current[index]?.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.1, 1],
                    }) || 1,
                },
              ],
            };

            return (
              <Animated.View
                key={index}
                style={[styles.inputContainer, animatedStyle]}
              >
                <TextInput
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={[styles.input, value[index] ? styles.filledInput : {}]}
                  maxLength={1}
                  keyboardType="number-pad"
                  editable={!disabled}
                  value={value[index]}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                  selectTextOnFocus
                  placeholder="-"
                  placeholderTextColor={COLOR.onMuted}
                />
              </Animated.View>
            );
          })}
      </View>

      <Pressable
        onPress={handleResendOTP}
        disabled={!isResendActive}
        style={{ width: '100%' }}
      >
        <ThemedText
          color="onMuted"
          variant="body"
          style={{ textAlign: 'center' }}
        >
          {isResendActive ? 'Resend Code' : `Resend OTP in ${countdown}s`}
        </ThemedText>
      </Pressable>
    </View>
  );
};

export default CodeInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
    gap: 8,
  },

  inputContainer: {
    width: moderateScale(50),
    height: moderateVerticalScale(50),
    boxShadow: SHADOW.md,
  },
  input: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: COLOR.card,
    borderWidth: 1,
    borderColor: COLOR.borderInput,
    textAlign: 'center',
    ...TEXT.body,
    color: COLOR.onCard,
  },
  filledInput: {
    backgroundColor: COLOR.muted,
    borderColor: COLOR.border,
  },
  resendContainer: {
    alignItems: 'center',
  },
});
