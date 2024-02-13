import { View, Text } from 'tamagui';
import Colors from '../../constants/Colors';
import { Input, Button } from 'tamagui';
import MessageBox from '../../components/messageBox'
import { FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useLocalSearchParams } from 'expo-router';

export default function ModalScreen() {

  type Data = {
    id: string,
    message: string
  }

  const { id } = useLocalSearchParams<{id: string}>();

  const [data, setData] = useState<Data[]>([]);

  const [text, setText] = useState('');

  const handleInputChange = (text: string):void => {
    // Update the state with the new input value
    setText(text);
  };

  const socket = io('http://192.168.153.168:9000'); // Replace with your server address

  const handleSendMessage = (message: string) => {
    // Emit the message to the server
    if (message != '') {
      socket.emit('user-message', message);
    }

    setText('');
  };

  useEffect(() => {
    // Listen for 'message' event from the server
    console.log('name: '+id);
    socket.on('message', (newMessage) => {
      // Update the state with the new message
      setData((prevData: Data[]) => [
        ...prevData,
        { id: generateUniqueId(), message: newMessage },
      ]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const generateUniqueId = (): string => {
    return new Date().getTime().toString(36) + Math.random().toString(36).substr(2);
  };

  const fetchMoreData = (message: string) => {
    const newData = [
      { id: generateUniqueId(), message: message }
    ];

    setData((prevData) => [...prevData, ...newData]);
  };

  type messageItem = {
    id: string;
    message: string;
  };

  type RenderItemProps = {
    item: messageItem;
  };

  const renderItem = ({ item }: RenderItemProps) => (
    <MessageBox text={item.message}></MessageBox>
  );

  return (
    <View flex={1} backgroundColor={Colors.dark.background} style={{
      paddingHorizontal:0
    }}>
      
      <View style={{flexDirection:'row', justifyContent:'center', width:'100%'}}>
        <Text fontSize={24} color={Colors.dark.primary} marginTop={32}>Hello {id}</Text>
      </View>

      <FlatList
      style={{marginBottom: 50}}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      />
      
      <View alignItems="stretch" flex={1} justifyContent='center' flexDirection='row' style={{position:'absolute', bottom: 0, padding:16}}>
     
     <Input 
     flex={0.8} 
     value={text}
     onChangeText={handleInputChange}
     size={'$4'} 
     marginRight={16}
     placeholder={`Enter message`} 
     backgroundColor={Colors.dark.background} 
     borderColor={Colors.dark.secondary}
     color={Colors.dark.text}/>

     <Button 
     flex={0.2} 
     size={'$4'} 
     backgroundColor={Colors.dark.primary}
     onPress={() => handleSendMessage(text)}>Send</Button>

   </View>
    </View>
  )
}
