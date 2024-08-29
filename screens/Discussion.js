import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Touchable,
  TextInput,
  Pressable,
  TouchableHighlight,
  KeyboardAvoidingView,
  StyleSheet,
  FlatList,
  Keyboard,
} from "react-native";
import { Icon } from "react-native-elements";

// mock comment text
const list_comments = [
  {
    votes: "0",
    id: "1",
    parent_id: "0",
    name: "david",
    image: "https://tr.web.img4.acsta.net/pictures/23/03/09/13/58/2006576.jpg",
    text: "John Wick is a retired assassin who returns back to his old ways after a group of Russian gangsters steal his car and kill a puppy which was gifted to him by his late wife Helen.",
  },
  {
    votes: "0",
    id: "2",
    parent_id: "0",
    name: "paul",
    image: "",
    text: "Forced to honor a debt from his past life, John Wick is sent to assassinate a target he has no wish to kill, where he faces betrayal at the hands of his sponsor.",
  },
  {
    votes: "0",
    id: "3",
    parent_id: "0",
    name: "johnny",
    image: "",
    text: "a former hitman who is drawn back into the criminal underworld he had previously abandoned.",
  },
  {
    votes: "0",
    id: "4",
    parent_id: "1",
    name: "zaheer",
    image: "",
    text: 'Every assassin in the world sticks to a strict code for conducting "business", revolving around the Continental hotel chain,',
  },
  {
    votes: "0",
    id: "5",
    parent_id: "1",
    name: "stephen",
    image: "",
    text: "The films have received critical acclaim and earned a collective gross of more than $1 billion worldwide.[4]",
  },
  {
    votes: "0",
    id: "6",
    parent_id: "2",
    name: "imran",
    image: "",
    text: "John Wick takes his fight against the High Table global as he seeks out more powerful players in the underworld from different countries.",
  },
  {
    votes: "0",
    id: "7",
    parent_id: "4",
    name: "martin",
    image: "",
    text: 'In May 2019, prior to the release of John Wick: Chapter 3 – Parabellum, Chad Stahelski confirmed on a Reddit "Ask Me Anything" thread that there has been discussion of another film',
  },
];

const comment_margin_left = 15;
export default function Discussion() {
  const [replyingTo, setReplyingTo] = useState("Root");
  const [listComment, setListComment] = useState([...list_comments]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = React.useRef(null);
  const renderItem = ({ item }) => {
    return <CommentItem comment={item} />;
  };
  const increment = ({ name }) => {
    // increment the correct vote
  };
  const decrement = ({ name }) => {
    // increment the correct vote
  };
  const send = () => {
    console.log(message);
    console.log(replyingTo);
    setMessage("");
    setReplyingTo("Root");
    Keyboard.dismiss();
  };
  React.useEffect(() => {
    if (replyingTo != "Root") {
      inputRef.current.focus();
    }
  }, [replyingTo]);
  const handleKeyboardHide = (event) => {
    setReplyingTo("Root");
    setIsKeyboardVisible(false);
  };
  useEffect(() => {
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );
  }, []);
  const CommentItem = ({ comment }) => {
    return (
      <View style={{ paddingHorizontal: 5 }}>
        <View
          style={[
            styles.commentItem,
            {
              marginLeft: comment.type * comment_margin_left,
              marginTop: comment.type === 0 ? 10 : 2,
            },
          ]}
        >
          <ProfilePic letter={comment.name[0]} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.commentBy}>{comment.name}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        </View>
        <View
          style={{
            marginLeft: comment.type * comment_margin_left + 30,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableHighlight
            style={{ borderRadius: 10 }}
            onPress={() => decrement(comment.id)}
          >
            <View>
              <Icon name="angle-up" type="font-awesome" size={15} />
            </View>
          </TouchableHighlight>
          <Text style={styles.votes}>{comment.votes}</Text>
          <TouchableHighlight
            style={{ borderRadius: 10 }}
            onPress={() => decrement(comment)}
          >
            <View>
              <Icon name="angle-down" type="font-awesome" size={15} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={{ marginLeft: 10, borderRadius: 10 }}
            onPress={() => setReplyingTo(comment.id)}
          >
            <View style={{ flexDirection: "row" }}>
              <Icon name="reply" type="font-awesome" size={15} />

              <Text style={styles.votes}>Reply</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  const ProfilePic = ({ letter = "" }) => {
    return (
      <View style={styles.profileImg}>
        <Text style={styles.profileText}>{letter.toUpperCase()}</Text>
      </View>
    );
  };

  React.useEffect(() => {
    var arr = [];
    var arr2 = [],
      arr3 = [];
    for (let item of list_comments) {
      if (item.parent_id === "0") {
        arr.push({ ...item, type: 0 });
        arr2 = list_comments.filter((ele) => ele.parent_id === item.id);
        if (arr2.length) {
          for (let item2 of arr2) {
            arr3 = list_comments.filter((ele) => ele.parent_id === item2.id);
            if (arr3.length) {
              arr.push({ ...item2, type: 1 });
              arr3 = arr3.map((ele) => ({ ...ele, type: 2 }));
              arr = arr.concat(arr3);
            } else {
              arr.push({ ...item2, type: 1 });
            }
          }
        }
      }
    }
    setListComment(arr);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: "#F0F0F0" }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Comments {listComment.length}</Text>
        <FlatList
          style={{ marginTop: 5 }}
          data={listComment}
          renderItem={renderItem}
          keyExtractor={(item, index) => "_cmt_item" + index}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: 5,
        }}
      >
        {replyingTo == "Root" ? (
          <View></View>
        ) : (
          <Text>Replying to {replyingTo}...</Text>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            value={message}
            ref={inputRef}
            onChangeText={(text) => setMessage(text)}
            style={{
              flex: 1,
              height: 40,
              borderWidth: 1,
              borderColor: "#dddddd",
              borderRadius: 20,
              paddingHorizontal: 10,
            }}
            placeholder="Type Your message..."
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginHorizontal: 8,
            }}
          ></View>

          <Pressable
            onPress={() => {
              send();
            }}
            style={{
              backgroundColor: "#007bff",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "snow",
    padding: 2,
    paddingTop: 20,
  },
  text: {
    fontSize: 12,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    //  paddingHorizontal: 3,
  },
  commentBy: {
    fontSize: 12,
    color: "#909090",
  },
  votes: {
    fontSize: 12,
    paddingHorizontal: 3,
    color: "#909090",
  },
  commentText: {
    marginTop: 5,
    fontSize: 12,
    color: "black",
  },
  profileImg: {
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "seagreen",
  },
  profileText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
});
