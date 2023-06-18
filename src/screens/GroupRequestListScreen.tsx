import React, { useRef, useState } from 'react';
import { GroupRequestListProps } from '../types/screenProps';
import { StyleSheet, View } from 'react-native';
import ListScrollView from '../components/ListScrollView';
import groupApi from '../api/group';
import {
  IconButton,
  Button,
  Card,
  Headline,
  Paragraph,
  Subheading,
  Divider,
} from 'react-native-paper';
import LoadingOverlay from '../components/LoadingOverlay';
import dateFormat from 'dateformat';
import AvatarListItem from '../components/AvatarListItem';

const GroupRequestListScreen = ({ navigation }: GroupRequestListProps) => {
  const refreshRef = useRef<(() => void) | undefined>();

  const [loading, setLoading] = useState<boolean>(false);

  const agreeOrReject =
    (groupId: number, userId: string, isAgree: boolean) => async () => {
      setLoading(true);

      const { error } = await groupApi.responseJoin(groupId, userId, isAgree);

      if (error) {
        console.error(error);
      }

      const refresh = refreshRef.current;
      refresh && refresh();

      setLoading(false);
    };

  return (
    <View style={styles.screen}>
      <LoadingOverlay visible={loading} />
      <ListScrollView
        getDataKey={(item: {
          groupId: number;
          userId: string;
          requestTime: string;
        }): React.Key => `${item.groupId}-${item.userId}`}
        fetchData={async () => {
          const { data, error } = await groupApi.getRequestList();
          if (!data) {
            console.error(error);
            return [];
          }
          return data.list;
        }}
        render={({
          groupId,
          groupName,
          userId,
          requestTime,
        }: {
          groupId: number;
          groupName: string;
          userId: string;
          requestTime: string;
        }) => {
          return (
            <Card style={styles.card}>
              <Card.Title title={dateFormat(requestTime, 'yyyy-mm-dd HH:MM')} />
              <Card.Content>
                <View style={styles.userLine}>
                  <AvatarListItem chatTarget={{ type: 'private', userId }} />
                  <Headline style={styles.userId}>{userId}</Headline>
                </View>
                <Divider />
                <View style={styles.groupLine}>
                  <Subheading>{`请求加入群「${groupName}」`}</Subheading>
                  <IconButton
                    icon='information-outline'
                    iconColor='#537188'
                    size={24}
                    onPress={() =>
                      navigation.navigate('GroupDetails', { groupId })
                    }
                  />
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={agreeOrReject(groupId, userId, true)}>
                  同意
                </Button>
                <Button onPress={agreeOrReject(groupId, userId, false)}>
                  拒绝
                </Button>
              </Card.Actions>
            </Card>
          );
        }}
        refreshRef={refreshRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  userLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userId: {
    marginHorizontal: 16,
  },
  groupLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default GroupRequestListScreen;
