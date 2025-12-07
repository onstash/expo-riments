import { Stack } from 'expo-router';

export default function ReanimatedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="progress-bar-animation" />
    </Stack>
  );
}
