import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { COLOR, FONT } from '@/constants/theme'

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLOR.background },
            animation: 'slide_from_right',
        }} />
    )
}

const styles = StyleSheet.create({})