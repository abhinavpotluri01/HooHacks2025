import { ScreenStack } from "react-native-screens";
import { StatusBar } from "expo-status-bar";
import "@/styles/global.css"
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { useFonts } from 'expo-font';
import { Text } from "react-native";

export default function RootLayout() {

  useEffect(()=> {
    NavigationBar.setVisibilityAsync('hidden')
  }, [])

  const [fontsLoaded] = useFonts({
    'Inter': require('@/assets/fonts/InterRegular.ttf'),
    'Inter-Bold': require('@/assets/fonts/InterBold.ttf'),
    'Inter-Black': require('@/assets/fonts/InterBlack.ttf'),
    'Inter-Thin': require('@/assets/fonts/InterThin.ttf'),
    'Inter-Light': require('@/assets/fonts/InterLight.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/InterSemiBold.ttf'),
    'Inter-Medium': require('@/assets/fonts/InterMedium.ttf'),
    'Inter-ExtraBold': require('@/assets/fonts/InterExtraBold.ttf'),
  });

  return (
  <>
  <View className='-z-20 absolute h-screen w-full bg-[rgb(24, 24, 24)]'/>

  <StatusBar hidden={true}/>
  <Stack >
    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
    <Stack.Screen name="shoe/[id]" options={{headerShown: false}} />
    <Stack.Screen name="chat/index" options={{headerShown: false}} />
  </Stack>
  </>
  )
}