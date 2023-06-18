import React from 'react';
import { StyleSheet, View } from 'react-native';
import AvatarListItem from './AvatarListItem';
import { Caption, Card, Divider, Paragraph, Title } from 'react-native-paper';
import { chatTimeFormatter, detailChatTimeFormatter } from '../utils/others';

interface ChatMessageProps {
  userId: string;
  avatarUrl?: string;
  time: Date;
  content: string;
  maxWidth?: number | string;
  isRight: boolean;
  showUser: boolean;
}

const ChatMessage = ({
  userId,
  avatarUrl,
  time,
  content,
  maxWidth,
  isRight,
  showUser,
}: ChatMessageProps) => {
  return (
    <View
      style={[
        styles.container,
        isRight ? { flexDirection: 'row-reverse' } : null,
        { maxWidth },
      ]}
    >
      <AvatarListItem
        chatTarget={{
          type: 'private',
          userId,
        }}
        url={avatarUrl}
        size={48}
        style={styles.avatar}
      />
      <View
        style={[
          styles.message,
          isRight ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <Card style={[styles.content]}>
          <Card.Content>
            {showUser && <Caption>{`[${userId}]`}</Caption>}
            <Paragraph>{content}</Paragraph>
            <Divider />
            <Caption
              style={[
                isRight ? styles.rightMessageTime : styles.leftMessageTime,
              ]}
            >
              {detailChatTimeFormatter(time)}
            </Caption>
          </Card.Content>
        </Card>
        {/* <View
          style={[
            styles.time,
            isRight ? styles.rightMessageTime : styles.leftMessageTime,
          ]}
        >
          <Caption>{detailChatTimeFormatter(time)}</Caption>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  avatar: {
    marginHorizontal: 10,
  },
  message: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  messageLeft: {
    marginLeft: 0,
    marginRight: 20,
  },
  messageRight: {
    marginRight: 0,
    marginLeft: 20,
  },
  content: {},
  leftMessageTime: {
    textAlign: 'left',
  },
  rightMessageTime: {
    textAlign: 'right',
  },
});

export default ChatMessage;
