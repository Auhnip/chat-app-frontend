/*
 * @Author       : wqph
 * @Date         : 2023-04-22 20:17:22
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-06-02 20:05:54
 * @FilePath     : \app-side\src\screens\MainTabScreens\FriendsScreen.tsx
 * @Description  : 主界面中的好友列表页面
 */

import React from 'react';
import { FriendsProps } from '../../types/screenProps';
import { List, Divider, FAB } from 'react-native-paper';
import userApi from '../../api/user';
import ListScrollView from '../../components/ListScrollView';
import AvatarListItem from '../../components/AvatarListItem';
import { StyleSheet, View } from 'react-native';

interface Friend {
  userId: string;
  userAvatar: string | null;
}

const FriendsScreen = ({ navigation }: FriendsProps) => {
  return (
    <View style={styles.container}>
      <ListScrollView
        getDataKey={(friend: Friend) => friend.userId}
        fetchData={async () => {
          const { data, error } = await userApi.getFriendsList();
          if (!data) {
            console.error(error);
            return [];
          }
          return data;
        }}
        render={({ userId, userAvatar }: Friend) => (
          <>
            <List.Item
              title={userId}
              left={({ style }) => (
                <AvatarListItem
                  chatTarget={{ type: 'private', userId }}
                  style={style}
                  url={userAvatar || undefined}
                />
              )}
              onPress={() =>
                // navigation.navigate('Chat', { type: 'private', userId })
                navigation.navigate('UserDetails', { userId })
              }
            />
            <Divider />
          </>
        )}
      />
      <FAB
        icon='plus'
        style={styles.fab}
        onPress={() => navigation.navigate('Search')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
  },
});

export default FriendsScreen;
