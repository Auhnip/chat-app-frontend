import React, { PropsWithChildren } from 'react';
import { UserDetails } from '../types';
import { Card, Headline, Subheading, Text } from 'react-native-paper';
import defaultUserAvatar from '../assets/defaultUserAvatar.jpg';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import dateFormat from 'dateformat';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface UserInformationProps {
  user: UserDetails;
  style?: StyleProp<ViewStyle>;
}

const UserInformation = ({ user, style }: UserInformationProps) => {
  const createTime = dateFormat(new Date(user.createdAt), 'yyyy-mm-dd-HH:MM');

  return (
    <Card style={[styles.card, style]}>
      <Card.Cover
        source={user.avatar ? { uri: user.avatar } : defaultUserAvatar}
      />
      <Card.Content style={styles.content}>
        <Headline style={styles.userId}>{user.userId}</Headline>
        <Subheading>
          <MaterialIcon
            name='email-variant'
            size={20}
            color='green'
            style={styles.informationIcon}
          />
          {user.email}
        </Subheading>
        <Subheading>
          <MaterialIcon
            name='web'
            size={20}
            color='blue'
            style={styles.informationIcon}
          />
          {`Joined at ${createTime}`}
        </Subheading>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
  userId: {
    marginVertical: 8,
  },
  content: {
    marginTop: 10,
  },
  informationIcon: { letterSpacing: 16 },
});

export default UserInformation;
