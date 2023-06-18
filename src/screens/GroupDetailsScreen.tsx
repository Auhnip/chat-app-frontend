import React, { useCallback, useState } from 'react';
import { GroupDetailsProps } from '../types/screenProps';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Divider,
  Headline,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import { GroupDetails } from '../types';
import { useAsyncEffect } from 'ahooks';
import groupApi from '../api/group';
import GroupInformation from '../components/GroupInformation';
import { useAppSelector, useLoadingAsyncEffect } from '../utils/hooks';
import EmptyDetails from '../components/EmptyDetails';
import LoadingOverlay from '../components/LoadingOverlay';

const statusMap = new Map([
  ['JOINED', '已加入'],
  ['WAITING', '等待通过申请'],
  ['REJECTED', '已被拒绝入群'],
  [null, '未加入'],
]);

const GroupDetailsScreen = ({ navigation, route }: GroupDetailsProps) => {
  /**
   * 界面显示的群聊 ID 与当前登录用户 ID
   */
  const { groupId } = route.params;
  const self = useAppSelector((state) => state.user.userId);

  /**
   * 界面所展示的内容及其获取函数
   */
  const [details, setDetails] = useState<GroupDetails | null>(null);
  const [status, setStatus] = useState<
    'JOINED' | 'WAITING' | 'REJECTED' | null
  >(null);

  const refreshDetails = async (groupId: number) => {
    const { data: detailsData, error: detailsError } =
      await groupApi.getGroupDetails(groupId);

    if (!detailsData) {
      console.error(detailsError);
      return;
    }

    setDetails(detailsData);
  };

  const refreshStatus = async (groupId: number) => {
    const { data: statusData, error: statusError } =
      await groupApi.getSelfStatus(groupId);

    if (!statusData) {
      console.error(statusError);
      return;
    }

    setStatus(statusData.status);
  };

  /**
   * 初次渲染时获取数据
   */
  const loading = useLoadingAsyncEffect(async () => {
    await refreshDetails(groupId);
    await refreshStatus(groupId);
  }, [groupId]);

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

    await refreshStatus(groupId);
    setLoadingStatus(false);
  };

  const onRequestJoin = useCallback(
    clickEvent(() => groupApi.requestJoin(groupId)),
    [groupId],
  );

  const onQuitGroup = useCallback(
    clickEvent(() => groupApi.quitGroup(groupId)),
    [groupId],
  );

  if (!details) {
    return (
      <>
        <EmptyDetails chatTarget={{ type: 'group', groupId }} />
        <LoadingOverlay visible={loading} />
      </>
    );
  }

  return (
    <View style={styles.screen}>
      <LoadingOverlay visible={loadingStatus} />
      <Headline style={styles.title}>群聊信息</Headline>
      <GroupInformation group={details} style={styles.card} />
      <Card style={styles.card}>
        <Card.Title title={`当前状态: ${statusMap.get(status)}`} />
        <Divider />
        {status === 'JOINED' ? (
          <>
            <Button
              mode='outlined'
              style={styles.topButton}
              onPress={() =>
                navigation.navigate('Chat', {
                  type: 'group',
                  groupId,
                })
              }
            >
              发消息
            </Button>
            {self !== details?.owner && (
              <Button
                mode='contained'
                style={styles.bottomButton}
                onPress={onQuitGroup}
              >
                退出该群
              </Button>
            )}
          </>
        ) : (
          <Button
            mode='outlined'
            style={styles.topButton}
            disabled={status === 'WAITING'}
            onPress={onRequestJoin}
          >
            申请入群
          </Button>
        )}
      </Card>
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
    marginTop: 48,
  },
  card: {
    margin: 16,
  },
  topButton: {
    margin: 16,
  },
  bottomButton: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
});

export default GroupDetailsScreen;
