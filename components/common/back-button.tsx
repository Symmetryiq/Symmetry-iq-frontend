import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';
import React from 'react';
import { Pressable } from 'react-native';

type BackButtonProps = {
  color?: keyof typeof Colors;
};

const BackButton = ({ color = 'onBackground' }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.back()}>
      <ArrowLeftIcon size={24} color={Colors[color]} />
    </Pressable>
  );
};

export default BackButton;
