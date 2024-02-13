import React, { useEffect, useState } from 'react'
import Colors from '../constants/Colors'
import { config } from '../tamagui.config'
import { TamaguiProvider } from 'tamagui'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Image, Text, Input, Button, View } from 'tamagui'
import { useColorScheme, StatusBar } from 'react-native'
import { useRouter } from 'expo-router'
import Friends from './friends/[id]'
import GetStarted from './getStarted'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { Toasts } from '@backpackapp-io/react-native-toast';


export default function NameScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [name, setName] = useState('');

  const [fontsLoaded, fontError] = useFonts({
    'Helvetica-Bold': require('../assets/fonts/helvetica-bold.ttf'),
    'Helvetica': require('../assets/fonts/helvetica.ttf'),
    'Helvetica-Light': require('../assets/fonts/helvetica-light.ttf'),
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
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      
        {/* <View style={{
          flex:1,
          backgroundColor:Colors.dark.background,
          alignItems:'center',
          justifyContent:'center'
        }}>
          <Image source={require('../assets/images/3d_smiley.png')} width={180} height={180}></Image>
          <Text fontFamily='$body' color={'white'} fontSize={24} fontWeight={'$13'}>Pick up an alias</Text>
          <Input 
            onChangeText={(value: string) => setName(value)}
            size={'$4'} 
            width={'50%'}
            marginTop={32}
            placeholder={`Name...`} 
            backgroundColor={Colors.dark.background} 
            borderColor={Colors.dark.secondary}
            selectionColor={Colors.dark.primary}
            cursorColor={Colors.dark.primary}
            textAlign='center'
            color={Colors.dark.text}/>
            <Button 
            backgroundColor={Colors.dark.primary} 
            size="$4" 
            width={'50%'} 
            marginTop={16}
            onPress={() => 
              router.push(`/friends/${name}`) 
              }>
              Enter
            </Button>
        </View> */}

        <View flex={1} onLayout={onLayoutRootView}>
          <GetStarted></GetStarted>
          {/* <Toasts />  */}
        </View>
       

      </ThemeProvider>
    </TamaguiProvider>
  )
}

