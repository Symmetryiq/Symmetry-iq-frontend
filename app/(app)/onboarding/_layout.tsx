import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import React from "react";

const OnboardingLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: "slide_from_right",
      }}
    />
  );
};

export default OnboardingLayout;
