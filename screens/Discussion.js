import React, { useState, useEffect } from "react";
import { fetchDataGET, fetchDataPOST } from "./utils/helpers";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  Platform,
  TextInput,
  Pressable,
  TouchableHighlight,
  KeyboardAvoidingView,
  StyleSheet,
  FlatList,
  Keyboard,
} from "react-native";
import { Icon } from "react-native-elements";

const comment_margin_left = 15;
export default function Discussion({ route, navigation }) {
  const [marginTextBox, setMarginTextBox] = useState(5);
  const [rootId, setRootId] = useState("");
  const [discussionBoardObject, setDiscussionBoardObject] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyingToName, setReplyingToName] = useState("");
  const [listComment, setListComment] = useState([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = React.useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const renderItem = ({ item }) => {
    return <CommentItem comment={item} />;
  };
  const increment = ({ name }) => {
    // increment the correct vote
  };
  const decrement = ({ name }) => {
    // increment the correct vote
  };
  function replyClick(id, name) {
    setReplyingTo(id);
    setReplyingToName(name);
  }
  const send = async () => {
    const currUser = await SecureStore.getItemAsync("currUser");
    if (replyingTo)
      await fetchDataPOST(`discussion`, {
        parent_id: replyingTo,
        body: message,
        author_id: currUser,
      });
    else
      await fetchDataPOST(`discussion`, {
        parent_id: rootId,
        body: message,
        author_id: currUser,
      });
    setMessage("");
    setDiscussionBoardObject(null);
    setReplyingTo(null);
    Keyboard.dismiss();
  };
  React.useEffect(() => {
    if (replyingTo != null) {
      inputRef.current.focus();
    }
  }, [replyingTo]);
  const handleKeyboardHide = (event) => {
    setMarginTextBox(5);
    setReplyingTo(null);
    setIsKeyboardVisible(false);
  };
  const handleKeyboardShow = (event) => {
    setMarginTextBox(100);
  };
  useEffect(() => {
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );
    const openSubscription = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
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
          {false && (
            <>
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
              </TouchableHighlight>{" "}
            </>
          )}
          {comment.type != 3 && (
            <TouchableHighlight
              style={{ marginLeft: 10, borderRadius: 10 }}
              onPress={() => replyClick(comment.id, comment.name)}
            >
              <View style={{ flexDirection: "row" }}>
                <Icon name="reply" type="font-awesome" size={15} />
                <Text style={styles.votes}>Reply</Text>
              </View>
            </TouchableHighlight>
          )}
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
  const getDiscussionBoard = async () => {
    setRefreshing(true);
    const project_res = await fetchDataGET(
      `project/${route.params.project_id}/`
    );
    console.log(project_res.data.discussion_board);
    setRootId(
      project_res.data.discussion_board.root.discussion_board_message_id
    );
    setDiscussionBoardObject(project_res.data.discussion_board);
    setRefreshing(false);
  };
  async function flatten(parent_id, comments) {
    if (comments == []) return [];
    let temp_comments = [];
    for (let i = 0; i < comments.length; i++) {
      let child_comments = await flatten(
        comments[i].discussion_board_message_id,
        comments[i].children
      );
      const name_response = await fetchDataGET(
        `user/${comments[i].author_id}/`
      );
      temp_comments.push({
        id: comments[i].discussion_board_message_id,
        text: comments[i].body,
        parent_id: parent_id,
        votes: "0",
        name: name_response.data.username,
      });
      temp_comments = temp_comments.concat(child_comments);
    }
    return temp_comments;
  }
  const setupDiscussionBoard = async () => {
    if (!discussionBoardObject) getDiscussionBoard();
    let temp_comments = [];
    if (discussionBoardObject) {
      let root = discussionBoardObject.root.children;
      temp_comments = await flatten(null, root);
      var arr = [];
      var arr2 = [];
      var arr3 = [];
      var arr4 = [];
      for (let item of temp_comments) {
        if (item.parent_id === null) {
          arr.push({ ...item, type: 0 });
          arr2 = temp_comments.filter((ele) => ele.parent_id === item.id);
          if (arr2.length) {
            for (let item2 of arr2) {
              arr.push({ ...item2, type: 1 });
              arr3 = temp_comments.filter((ele) => ele.parent_id === item2.id);
              if (arr3.length) {
                for (let item3 of arr3) {
                  arr.push({ ...item3, type: 2 });
                  arr4 = temp_comments.filter(
                    (ele) => ele.parent_id === item3.id
                  );
                  if (arr4.length) {
                    arr4 = arr4.map((ele) => ({ ...ele, type: 3 }));
                    arr = arr.concat(arr4);
                  }
                }
              }
            }
          }
        }
      }
      setListComment(arr);
    }
  };
  React.useEffect(() => {
    setupDiscussionBoard();
  }, [discussionBoardObject]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{ flex: 1, backgroundColor: "#F0F0F0" }}
    >
      <View style={styles.container}>
        <FlatList
          onRefresh={getDiscussionBoard}
          refreshing={refreshing}
          style={{ marginTop: 0 }}
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
        }}
      >
        {replyingTo == null ? (
          <View></View>
        ) : (
          <Text>Replying to {replyingToName}...</Text>
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
    fontSize: 14,
    color: "black",
  },
  profileImg: {
    height: 30,
    width: 30,
    borderRadius: 15,
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
