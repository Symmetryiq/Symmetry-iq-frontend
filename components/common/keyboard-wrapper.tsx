import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native";

type KeyboardWrapperProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const KeyboardWrapper = ({ children, style }: KeyboardWrapperProps) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, style]}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
