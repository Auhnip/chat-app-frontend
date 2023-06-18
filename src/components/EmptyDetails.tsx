import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatTarget } from '../types';
import { Headline, Subheading } from 'react-native-paper';
import { groupIdToString } from '../utils/others';

interface EmptyDetailsProps {
  chatTarget: ChatTarget;
}

const chatTargetFormatter = (chatTarget: ChatTarget): string => {
  if (chatTarget.type === 'private') {
    return `用户 [${chatTarget.userId}]`;
  }

  return `群组 [${groupIdToString(chatTarget.groupId)}]`;
};

const EmptyDetails = ({ chatTarget }: EmptyDetailsProps) => {
  return (
    <View style={styles.box}>
      <Headline>似乎没有关于</Headline>
      <Headline>{chatTargetFormatter(chatTarget)}</Headline>
      <Headline>的消息</Headline>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
  },
});

export default EmptyDetails;
