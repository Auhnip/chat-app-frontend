import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatProps } from '../types/screenProps';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Caption,
  Divider,
  Headline,
  HelperText,
  Snackbar,
  TextInput,
  useTheme,
} from 'react-native-paper';
import ChatContent from '../components/ChatContent';
import messageApi from '../api/message';
import { useFocusEffect } from '@react-navigation/native';
import { useAppSelector, useChatTargetName } from '../utils/hooks';
import { selectMessageRecordsById } from '../store/messageSlice';
import { groupIdToString } from '../utils/others';
import groupApi from '../api/group';
import { useLockFn } from 'ahooks';

const ChatScreen = ({
  navigation,
  route: { params: chatTarget },
}: ChatProps) => {
  const chatTargetName = useChatTargetName(chatTarget);

  /**
   * 组件属性变量以及回调
   */
  const [textInput, setTextInput] = useState<string>('');
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const contentRef = useRef<ScrollView>(null);

  const sendMessage = useLockFn(async () => {
    if (textInput.trim() === '') {
      setErrorVisible(true);
      return;
    }

    const message = textInput;
    setTextInput('');

    const { error } = await messageApi.sendMessage(chatTarget, message);
    if (error) {
      console.error(error);
    }
  });

  /**
   * 保证每次抵达这个界面，都滑到最新消息处
   */
  useFocusEffect(() => {
    contentRef.current?.scrollToEnd({ animated: false });
  });

  /**
   * 当前界面需要展示的消息记录
   */
  const messageRecords = useAppSelector(selectMessageRecordsById(chatTarget));

  /**
   * 消息记录更新时，滑到最新消息处
   */
  useEffect(() => {
    contentRef.current?.scrollToEnd();
  }, [messageRecords]);

  return (
    <View style={styles.screen}>
      <View style={styles.titleBar}>
        <Headline>{chatTargetName}</Headline>
        <View style={styles.statusBar}>
          <View style={styles.signal} />
          <Caption>共享数据中 {'>>'}</Caption>
        </View>
      </View>
      <Divider />
      <View style={styles.chatArea}>
        <ScrollView ref={contentRef} style={styles.chatBox}>
          <ChatContent chatTarget={chatTarget} />
        </ScrollView>
        <Snackbar
          visible={errorVisible}
          onDismiss={() => setErrorVisible(false)}
          duration={Snackbar.DURATION_SHORT}
        >
          不可以发送空信息噢
        </Snackbar>
      </View>
      <Divider />
      <View style={styles.inputBar}>
        <TextInput
          mode='outlined'
          label={'说点什么...'}
          style={styles.textInput}
          value={textInput}
          onChangeText={(text) => setTextInput(text)}
        />
        <Button
          icon='send'
          mode='contained'
          style={styles.sendButton}
          onPress={sendMessage}
        >
          发送
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleBar: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  chatArea: {
    flex: 1,
    position: 'relative',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  signal: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'green',
    marginRight: 8
  },
  chatBox: {
    flex: 1,
  },
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 6,
  },
  sendButton: {
    marginHorizontal: 6,
  },
  hint: {
    position: 'absolute',
    top: -5,
  },
});

export default ChatScreen;
