import React from 'react';
import { GroupsProps } from '../../types/screenProps';
import ListScrollView from '../../components/ListScrollView';
import userApi from '../../api/user';
import AvatarListItem from '../../components/AvatarListItem';
import { Divider, FAB, List } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface Group {
  groupId: number;
  groupName: string;
  groupAvatar: string | null;
}

const GroupsScreen = ({ navigation }: GroupsProps) => {
  return (
    <View style={styles.container}>
      <ListScrollView
        getDataKey={(group: Group) => group.groupId}
        fetchData={async () => {
          const { data, error } = await userApi.getGroupsList();
          if (!data) {
            console.error(error);
            return [];
          }
          return data;
        }}
        render={({ groupId, groupName, groupAvatar }: Group) => {
          return (
            <>
              <List.Item
                title={groupName}
                left={({ style }) => (
                  <AvatarListItem
                    chatTarget={{ type: 'group', groupId }}
                    style={style}
                    url={groupAvatar || undefined}
                  />
                )}
                onPress={() => navigation.navigate('GroupDetails', { groupId })}
              />
              <Divider />
            </>
          );
        }}
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

export default GroupsScreen;
