import React, { useCallback, useEffect, useState } from 'react';
import { UserDetailsProps } from '../types/screenProps';
import { UserDetails, UserRelation } from '../types';
import UserInformation from '../components/UserInformation';
import {
  Button,
  Card,
  Divider,
  Headline,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import userApi from '../api/user';
import { StyleSheet, View } from 'react-native';
import { useAsyncEffect } from 'ahooks';
import EmptyDetails from '../components/EmptyDetails';
import { useAppSelector, useLoadingAsyncEffect } from '../utils/hooks';
import LoadingOverlay from '../components/LoadingOverlay';
import FriendsApi from '../api/friends';

type RelationTextMap = {
  [index in UserRelation]: string;
};

const relationText: RelationTextMap = {
  Stranger: '陌生人',
  Requested: '已申请好友',
  Pending: '对方已申请好友',
  Rejected: '对方已拒绝成为您的好友',
  Declined: '已拒绝对方的好友申请',
  Accepted: '好友',
};

const UserDetailsScreen = ({ navigation, route }: UserDetailsProps) => {
  /**
   * 界面显示的用户 ID 与当前登录用户 ID
   */
  const { userId } = route.params;
  const self = useAppSelector((state) => state.user.userId);

  /**
   * 界面所展示的内容及其获取函数
   */
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [relation, setRelation] = useState<UserRelation>('Stranger');

  const refreshDetails = async (userId: string) => {
    const { data: detailsData, error: detailsError } =
      await userApi.userDetails(userId);

    if (!detailsData) {
      console.error(detailsError);
      return;
    }

    setDetails(detailsData);
  };

  const refreshRelation = async (userId: string) => {
    const { data: relationData, error: relationError } =
      await FriendsApi.userRelationWith(userId);

    if (!relationData) {
      console.error(relationError);
      return;
    }

    setRelation(relationData.relation);
  };

  /**
   * 初次渲染时获取数据
   */
  const loadingScreen = useLoadingAsyncEffect(async () => {
    await refreshDetails(userId);
    await refreshRelation(userId);
  }, [userId]);

  /**
   * 各个操作的事件函数及状态
   */
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [hintVisible, setHintVisible] = useState<boolean>(false);

  const clickEvent = (effect: () => Promise<{ error: any }>) => async () => {
    setLoadingStatus(true);

    const { error } = await effect();

    if (error) {
      console.error(error);
      setLoadingStatus(false);
      setHintVisible(true);
      return;
    }

    await refreshRelation(userId);
    setLoadingStatus(false);
  };

  const onRequestFriends = useCallback(
    clickEvent(() => FriendsApi.requestFor(userId)),
    [userId],
  );

  const onAgreedFriends = useCallback(
    clickEvent(() => FriendsApi.responseFor(userId, 'AGREED')),
    [userId],
  );

  const onRejectFriends = useCallback(
    clickEvent(() => FriendsApi.responseFor(userId, 'REJECTED')),
    [userId],
  );

  const onDeleteFriend = useCallback(
    clickEvent(() => FriendsApi.deleteFriend(userId)),
    [userId],
  );

  /**
   * 默认展示
   */
  if (!details) {
    return (
      <>
        <EmptyDetails chatTarget={{ type: 'private', userId }} />
        <LoadingOverlay visible={loadingScreen} />
      </>
    );
  }

  return (
    <View style={styles.screen}>
      <LoadingOverlay visible={loadingStatus} />
      <Headline style={styles.title}>用户信息</Headline>
      <UserInformation user={details} style={styles.card} />
      {self !== userId && (
        <Card style={styles.card}>
          <Card.Title title={`关系状态：${relationText[relation]}`} />
          <Divider />
          {relation === 'Accepted' && (
            <>
              <Button
                mode='outlined'
                style={styles.middleButton}
                onPress={() =>
                  navigation.navigate('Chat', { type: 'private', userId })
                }
              >
                发消息
              </Button>
              <Button
                mode='contained'
                style={styles.bottomButton}
                onPress={() => setHintVisible(true)}
                onLongPress={onDeleteFriend}
              >
                删除好友（请长按~）
              </Button>
            </>
          )}
          {['Declined', 'Pending'].includes(relation) && (
            <>
              <Button
                mode='contained'
                style={styles.bottomButton}
                onPress={onAgreedFriends}
              >
                通过申请
              </Button>
              <Button
                mode='outlined'
                style={styles.bottomButton}
                onPress={onRejectFriends}
                disabled={relation === 'Declined'}
              >
                拒绝申请
              </Button>
            </>
          )}
          {['Stranger', 'Requested', 'Rejected'].includes(relation) && (
            <Button
              mode='contained'
              style={styles.bottomButton}
              disabled={relation === 'Requested'}
              onPress={onRequestFriends}
            >
              申请好友
            </Button>
          )}
        </Card>
      )}
      <Snackbar
        visible={hintVisible}
        onDismiss={() => setHintVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        操作失败
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    marginHorizontal: 32,
    marginTop: 64,
  },
  card: {
    margin: 16,
  },
  bottomButton: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  middleButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});

export default UserDetailsScreen;
