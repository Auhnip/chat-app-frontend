/*
 * @Author       : wqph
 * @Date         : 2023-05-14 00:21:21
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-05-19 00:48:40
 * @FilePath     : \app-side\src\components\ChatListItem.tsx
 * @Description  : 最近聊天列表的列表项组件
 */

import React from 'react';
import { GroupMessageRecords, PrivateMessageRecords } from '../utils/messages';
import { Divider, List, Text } from 'react-native-paper';
import AvatarListItem from './AvatarListItem';
import { chatTimeFormatter } from '../utils/others';
import { useChatTargetName } from '../utils/hooks';

const ChatListItem = ({
  messageRecords,
  onPress,
}: {
  messageRecords: PrivateMessageRecords | GroupMessageRecords;
  onPress?: () => void;
}) => {
  const isPrivate = messageRecords.type === 'private';

  const { lastMessage } = messageRecords;

  const chatTargetName = useChatTargetName(messageRecords);

  const outlet = isPrivate
    ? lastMessage.content
    : `${lastMessage.from}: ${lastMessage.content}`;

  return (
    <React.Fragment>
      <List.Item
        title={chatTargetName}
        titleNumberOfLines={1}
        titleEllipsizeMode='tail'
        description={outlet}
        descriptionNumberOfLines={1}
        descriptionEllipsizeMode='tail'
        right={({ color }) => (
          <Text style={{ color }}>{chatTimeFormatter(lastMessage.sendAt)}</Text>
        )}
        left={(props) => (
          <AvatarListItem
            chatTarget={{ ...messageRecords }}
            style={props.style}
          />
        )}
        onPress={onPress}
      />
      <Divider />
    </React.Fragment>
  );
};

export default ChatListItem;
