import { FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { View, Text, Input, Button, Avatar, Circle, XStack } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import MessageBox from "../../components/messageBox";
import Colors from "../../constants/Colors";

export default function Friends() {
  return (
    <View
      backgroundColor={Colors.dark.background}
      flex={1}
      paddingHorizontal={16}
    >
      <Text
        color={"white"}
        width={"100%"}
        textAlign="center"
        fontWeight={"500"}
        fontSize={18}
        marginTop={32}
      >
        Buddy list
      </Text>

      <View
        backgroundColor={Colors.dark.secondary}
        borderRadius={16}
        marginTop={16}
        padding={16}
        alignItems="center"
        width='$12'
      >
        <Avatar circular size="$6">
          <Avatar.Image src={require('D:/react-native-basics/socket-io-app/socket-io-app/assets/images/white_man.png')} />
          <Avatar.Fallback bc="red" />
        </Avatar>

        <XStack marginTop={16}>
          <Text color={"whitesmoke"} fontWeight={"$14"}>Aditya</Text>
          <Circle size="$1" backgroundColor={"greenyellow"} marginStart={8}/>
        </XStack>

      </View>
    </View>
  );
}
