import React, { useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import publicApi from '../api/public';
import { Avatar } from 'react-native-paper';
import { ChatTarget } from '../types';
import defaultUserAvatar from '../assets/defaultUserAvatar.jpg';
import defaultGroupAvatar from '../assets/defaultGroupAvatar.jpg';

interface UserAvatarListItemProps {
  chatTarget: ChatTarget;
  style?: StyleProp<ViewStyle>;
  size?: number;
  url?: string;
}

const AvatarListItem = ({
  chatTarget,
  style,
  size,
  url,
}: UserAvatarListItemProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      setAvatarUrl(url);
      return;
    }

    (async () => {
      const { data, error } = await publicApi.getAvatar(chatTarget);

      if (!data) {
        console.log(error);
        return;
      }

      setAvatarUrl(data.avatar);
    })();
  }, [chatTarget, url]);

  /**
   * 存在该头像
   */
  if (avatarUrl) {
    return (
      <Avatar.Image style={style} size={size} source={{ uri: avatarUrl }} />
    );
  }

  /**
   * 默认头像
   */
  return (
    <Avatar.Image
      style={style}
      size={size}
      source={
        chatTarget.type === 'private' ? defaultUserAvatar : defaultGroupAvatar
      }
    />
  );
};

export default AvatarListItem;
