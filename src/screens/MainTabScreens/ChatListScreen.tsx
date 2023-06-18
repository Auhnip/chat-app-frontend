/*
 * @Author       : wqph
 * @Date         : 2023-04-22 20:22:30
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-06-04 01:37:43
 * @FilePath     : \app-side\src\screens\MainTabScreens\ChatListScreen.tsx
 * @Description  : 主界面中的最近聊天页面
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChatListProps } from '../../types/screenProps';
import { ScrollView, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import ChatListItem from '../../components/ChatListItem';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { fetchMessageHistory } from '../../store/messageSlice';
import EmptyList from '../../components/EmptyList';

const ChatListScreen = ({ navigation }: ChatListProps) => {
  /**
   * 渲染最近聊天列表
   */
  const records = useAppSelector((state) => state.messages.messageRecords);

  const recordList = useMemo(
    () =>
      records.map((record) => (
        <ChatListItem
          key={record.type === 'private' ? record.userId : record.groupId}
          messageRecords={record}
          onPress={() => navigation.navigate('Chat', { ...record })}
        />
      )),
    [records],
  );

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  /**
   * 刷新操作
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    dispatch(fetchMessageHistory(7));
  }, []);

  /**
   * 检查是否刷新成功
   */
  const status = useAppSelector((state) => state.messages.status);
  useEffect(() => {
    if (status !== 'success' && status !== 'failed') {
      return;
    }

    setRefreshing(false);
  }, [status]);

  if (records.length === 0) {
    return <EmptyList />
  }
  
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {recordList}
    </ScrollView>
  );
};

export default ChatListScreen;
