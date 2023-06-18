import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useAppSelector } from '../utils/hooks';
import { selectMessageRecordsById } from '../store/messageSlice';
import { ChatTarget } from '../types';
import ChatMessage from './ChatMessage';
import publicApi from '../api/public';

interface ChatContentProps {
  chatTarget: ChatTarget;
}

const ChatContent = ({ chatTarget }: ChatContentProps) => {
  const isPrivate = chatTarget.type === 'private';
  const userId = useAppSelector((state) => state.user.userId);
  const userAvatar = useAppSelector((state) => state.user.avatar);
  const messageRecords = useAppSelector(selectMessageRecordsById(chatTarget));

  const [chatTargetAvatar, setChatTargetAvatar] = useState<string>();

  useEffect(() => {
    (async () => {
      const { data, error } = await publicApi.getAvatar(chatTarget);

      if (!data) {
        console.log(error);
        return;
      }

      setChatTargetAvatar(data.avatar ?? undefined);
    })();
  }, [chatTarget]);

  return (
    <View>
      {messageRecords?.records.map((message) => {
        return (
          <ChatMessage
            key={JSON.stringify(message)}
            userId={message.from}
            time={new Date(message.sendAt)}
            content={message.content}
            avatarUrl={
              isPrivate
                ? message.from === userId && userAvatar
                  ? userAvatar
                  : chatTargetAvatar
                : undefined
            }
            isRight={message.from === userId}
            showUser={chatTarget.type === 'group'}
          />
        );
      })}
    </View>
  );
};

export default ChatContent;
