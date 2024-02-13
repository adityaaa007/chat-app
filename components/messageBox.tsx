import React, { useState } from 'react';
import { View, Text } from 'tamagui';
import Colors from '../constants/Colors';
import { StyleSheet } from 'react-native';

export default function messageBox(props: {text: String}) {

  return (
  <View style={styles.container}>
    <View style={styles.textContainer}>
      <Text 
        color={'white'}
        style={{backgroundColor:Colors.dark.primary, 
          marginTop:12,
          padding:8, 
          paddingHorizontal:16,
          borderTopRightRadius:12, 
          borderBottomLeftRadius:12, 
          borderBottomRightRadius:12,
          flexShrink:1}}>{props.text}</Text>
          </View>
{/* Add more Text components as needed */}
</View>
)}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart:16
  },
  textContainer: {
    marginRight: 10, // Adjust margin as needed
    alignSelf: 'flex-start', // Allows each Text component to determine its own width
  },
  text: {
    // Add additional styling as needed
  },
});