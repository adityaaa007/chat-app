import { View, Avatar } from "tamagui";
import Colors from "../../constants/Colors";
import MessageBox from "../../components/messageBox";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StatusBar,
  Keyboard,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { storage } from "../utils/Storage";
import { ChevronLeft, SendHorizonal, SmilePlus } from "lucide-react-native";
import ProfileData from "../../constants/ProfileData";
import { router } from "expo-router";
import EmojiPicker, { emojiFromUtf16 } from "rn-emoji-picker";
import { emojis } from "rn-emoji-picker/dist/data";

const socket = io("http://65.1.114.171:9000"); // Replace with your server address

const id = storage.getString("id");
const friendId = storage.getString("friend-id");
const name = storage.getString("name");
const friendName = storage.getString("friend-name");

console.log(
  storage.getString("friend-name") + " " + storage.getString("friend-id")
);

const data = ProfileData.data;

// Function to fetch the title based on the id
function getImageById(id: string) {
  const item = data.find((item) => item.id === id);
  return item ? item.title : null;
}

// Function to generate a unique room name between two users
function generateRoomName(user1Id: string, user2Id: string): string {
  // Sort the user IDs alphabetically
  const sortedIds = [user1Id, user2Id].sort();
  // Concatenate the sorted user IDs with a separator
  let concatenatedString = sortedIds.join("");
  concatenatedString = concatenatedString.split("").sort().join("");
  console.log(concatenatedString);

  return concatenatedString;
}

const roomName = generateRoomName(name!, friendName!);

const messageHandler = (message: string) => {
  const data = {
    room: roomName,
    message: message,
    name: name,
  };
  // Emit the message to the server
  if (message != "") {
    socket.emit("messageToServer", data);
  }
};

//join the room
socket.emit("joinRoom", roomName);

export default function Chat() {
  type Data = {
    id: string;
    message: string;
    self: boolean;
    time: string;
  };

  const [data, setData] = useState<Data[]>([]);

  const [text, setText] = useState("");

  const [showEmoji, setShowEmoji] = useState(false);

  const [recent, setRecent] = useState([]);

  const flatListRef = useRef<FlatList | null>(null);

  // Function to scroll FlatList to the bottom
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Scroll to bottom whenever data changes
  useEffect(() => {
    scrollToBottom();
  }, [data]); // Assuming data is your FlatList data array

  // const [messageHandler, setMessageHandler] = useState<() => void>(() => {
  //   console.log('Function defined inside useEffect');
  // });

  const handleInputChange = (text: string): void => {
    // Update the state with the new input value
    setText(text);
  };

  console.log("remounted...");

  useEffect(() => {
    // Listen for 'message' event from the server
    console.log("useEffect....");

    socket.on("message", (data) => {
      // Update the state with the new message
      console.log("name: " + data.name + " my name: " + name);

      if (data.name != name) {
        setData((prevData: Data[]) => [
          ...prevData,
          {
            id: generateUniqueId(),
            message: data.message,
            self: false,
            time: data.time,
          },
        ]);
      }
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const generateUniqueId = (): string => {
    return (
      new Date().getTime().toString(36) + Math.random().toString(36).substr(2)
    );
  };

  type messageItem = {
    id: string;
    message: string;
    self: boolean;
    time: string;
  };

  type RenderItemProps = {
    item: messageItem;
  };

  const renderItem = ({ item }: RenderItemProps) => (
    <MessageBox
      text={item.message}
      self={item.self}
      time={item.time}
    ></MessageBox>
  );

  return (
    <View
      flex={1}
      backgroundColor={"black"}
      style={{
        paddingHorizontal: 0,
      }}
    >
      <StatusBar barStyle={"light-content"} backgroundColor={"black"} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <ChevronLeft color={"gray"} size={24} style={{ margin: 20 }} />
        </TouchableOpacity>

        <Avatar size="$4" circular>
          <Avatar.Image src={getImageById(friendId ? friendId : "1")} />
          <Avatar.Fallback bc={Colors.dark.secondary} />
        </Avatar>

        <Text
          style={{
            fontFamily: "Helvetica",
            fontSize: 16,
            color: "white",
            marginStart: 8,
          }}
        >
          {friendName}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        style={{ marginBottom: 84, marginTop: 16 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onContentSizeChange={scrollToBottom}
      />

      <View
        alignItems="stretch"
        justifyContent="center"
        flexDirection="row"
        style={{
          position: "absolute",
          bottom: showEmoji ? 264 : 0,
          padding: 16,
          width: "100%",
        }}
      >
        <TextInput
          style={{
            fontFamily: "Helvetica",
            fontSize: 14,
            backgroundColor: "black",
            borderWidth: 2,
            borderColor: Colors.dark.secondary,
            color: "white",
            padding: 8,
            paddingHorizontal: 16,
            borderRadius: 10,
            flex: 0.85,
          }}
          placeholderTextColor={"gray"}
          value={text}
          onChangeText={handleInputChange}
          placeholder={`Enter message`}
        />

        <TouchableOpacity
          style={{ position: "absolute", bottom: 8, right: 64, padding: 8 }}
          onPress={() => {
            setShowEmoji(!showEmoji);

            Keyboard.dismiss();
          }}
        >
          <SmilePlus
            color={Colors.dark.primary}
            size={24}
            style={{ margin: 20 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 0.15 }}
          onPress={() => {
            messageHandler(text);

            // for showing self message
            if (text != "") {
              setData((prevData: Data[]) => [
                ...prevData,
                {
                  id: generateUniqueId(),
                  message: text,
                  self: true,
                  time: getCurrentTime(),
                },
              ]);
            }

            setText("");
          }}
        >
          <SendHorizonal
            color={Colors.dark.primary}
            size={24}
            style={{ margin: 20 }}
          />
        </TouchableOpacity>
      </View>

      {showEmoji ? (
        <EmojiPicker
          emojis={emojis} // emojis data source see data/emojis
          autoFocus={false} // autofocus search input
          loading={false} // spinner for if your emoji data or recent store is async
          darkMode={true} // to be or not to be, that is the question
          perLine={10} // # of emoji's per line
          onSelect={(emoji) => {
            setText(text.concat(emoji.emoji));
          }} // callback when user selects emoji - returns emoji obj
        />
      ) : null}
    </View>
  );
}

const getCurrentTime = () => {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return currentDate.toLocaleTimeString("en-US", options);
};
