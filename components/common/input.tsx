import { Colors } from '@/constants/theme';
import { scale, verticalScale } from '@/helpers/scale';
import { InputProps } from '@/helpers/types';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        props.containerStyle && props.containerStyle,
        isFocused && styles.primaryBorder,
      ]}
    >
      {props.icon && props.icon}

      <TextInput
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={Colors.onMuted}
        ref={props.inputRef && props.inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: verticalScale(56),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 200,
    paddingHorizontal: scale(16),
    backgroundColor: Colors.muted,
    gap: scale(8),
  },

  primaryBorder: {
    borderColor: Colors.primary,
  },

  input: {
    flex: 1,
    color: Colors.onMuted,
    fontSize: verticalScale(16),
  },
});
