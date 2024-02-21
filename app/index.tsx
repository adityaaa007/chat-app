import React, { useEffect } from "react";
import { config } from "../tamagui.config";
import { TamaguiProvider } from "tamagui";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { View } from "tamagui";
import { AppState, useColorScheme } from "react-native";
import Friends from "./friends/friends";
import GetStarted from "./getStarted";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { storage } from "./utils/Storage";
import { io } from "socket.io-client";
import { router } from "expo-router";

export default function NameScreen() {
  useEffect(() => {
    

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Send message when app is about to be backgrounded or terminated
        console.log('index is unmounted...');
        
        if(storage.getString('name')) {
          const socket = io("http://65.1.114.171:9000");

          const name = storage.getString('name');
          const id = storage.getString('id');

          socket.emit('user-connect',{name: name, id: id, active: false});

          socket.disconnect()
        }

      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  },[])

  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    "Helvetica-Bold": require("../assets/fonts/helvetica-bold.ttf"),
    Helvetica: require("../assets/fonts/helvetica.ttf"),
    "Helvetica-Light": require("../assets/fonts/helvetica-light.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {storage.getString("name") ? (
          <View flex={1} onLayout={onLayoutRootView}>
            <Friends></Friends>
          </View>
        ) : (
          <View flex={1} onLayout={onLayoutRootView}>
            <GetStarted></GetStarted>
          </View>
        )}
      </ThemeProvider>
    </TamaguiProvider>
  );
}
