import React from 'react';
import { GroupDetails } from '../types';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import {
  Caption,
  Card,
  Divider,
  Headline,
  Paragraph,
  Subheading,
  Text,
} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import defaultGroupAvatar from '../assets/defaultGroupAvatar.jpg';
import dateFormat from 'dateformat';

interface GroupInformationProps {
  group: GroupDetails;
  style?: StyleProp<ViewStyle>;
}

const GroupInformation = ({ group, style }: GroupInformationProps) => {
  const createTime = dateFormat(new Date(group.createdAt), 'yyyy-mm-dd-HH:MM');

  return (
    <Card style={[styles.card, style]}>
      <Card.Cover
        source={group.avatar ? { uri: group.avatar } : defaultGroupAvatar}
      />

      <Card.Content style={styles.content}>
        <Headline>{group.name}</Headline>
        <Caption>
          <MaterialIcon
            name='id-card'
            size={16}
            color='#AEE2FF'
            style={styles.informationIcon}
          />
          {`ID: ${group.groupId}`}
        </Caption>
        <Caption>
          <MaterialIcon
            name='account-key-outline'
            size={16}
            color='#ACBCFF'
            style={styles.informationIcon}
          />
          {`Owned by: ${group.owner}`}
        </Caption>
        <Caption>
          <MaterialIcon
            name='web'
            size={16}
            color='#B799FF'
            style={styles.informationIcon}
          />
          {`Created at: ${createTime}`}
        </Caption>
        <Divider style={styles.divider} />
        <Subheading>Description:</Subheading>
        <Paragraph>{group.description}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
  content: {
    marginTop: 10,
  },
  divider: {
    marginVertical: 8,
  },
  informationIcon: {
    letterSpacing: 16,
  },
});

export default GroupInformation;
