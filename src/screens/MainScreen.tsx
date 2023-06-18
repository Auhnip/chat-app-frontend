/*
 * @Author       : wqph
 * @Date         : 2023-04-12 22:17:50
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-05-30 23:15:09
 * @FilePath     : \app-side\src\screens\MainScreen.tsx
 * @Description  : 用户登录成功后进入的主界面
 */

import React, { useEffect, useRef } from 'react';
import { MainProps, MainTabParamList } from '../types/screenProps';
import FriendsScreen from './MainTabScreens/FriendsScreen';
import ChatListScreen from './MainTabScreens/ChatListScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SettingScreen from './MainTabScreens/SettingScreen';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { addMessage, fetchMessageHistory } from '../store/messageSlice';
import { serverAddress } from '../utils/network';
import { GroupMessage, PrivateMessage } from '../utils/messages';
import GroupsScreen from './MainTabScreens/GroupsScreen';

const Tab = createMaterialTopTabNavigator<MainTabParamList>();

const MainScreen = (props: MainProps) => {
  const connection = useRef<WebSocket | null>(null);

  const dispatch = useAppDispatch();

  /**
   * 加载历史记录
   */
  useEffect(() => {
    dispatch(fetchMessageHistory(7));
  }, [dispatch]);

  const { status: messageStatus } = useAppSelector((state) => state.messages);
  const { status: userStatus, accessToken } = useAppSelector(
    (state) => state.user,
  );
  /**
   * 历史记录加载完成后，与服务器建立 WebSocket 连接
   */
  useEffect(() => {
    // 对不需要建立连接的情况返回 undefined，表明不需要断开连接
    if (messageStatus !== 'success' || userStatus !== 'success') {
      return;
    }

    const connectionState = connection.current?.readyState;
    if (
      connectionState === WebSocket.OPEN ||
      connectionState === WebSocket.CONNECTING
    ) {
      return;
    }

    const ws = new WebSocket(`ws://${serverAddress}/ws?token=${accessToken}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as PrivateMessage | GroupMessage;

      dispatch(addMessage(message));
    };

    ws.onerror = (event) => {
      console.error(event.message);
    };

    connection.current = ws;
    console.log('New WebSocket connection established');

    // 此时已建立起新连接，离开时需要断开连接
    return () => {
      connection.current?.close();
      console.log('WebSocket disconnected');
    };
  }, [dispatch, userStatus, messageStatus, accessToken]);

  return (
    <Tab.Navigator
      initialRouteName='ChatList'
      screenOptions={{ tabBarShowIcon: false, tabBarShowLabel: true }}
    >
      <Tab.Screen
        name='ChatList'
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name='chat' color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name='Friends'
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name='account-multiple' color={color} />
          ),
        }}
      />
      <Tab.Screen name='Groups' component={GroupsScreen} />
      <Tab.Screen name='Setting' component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default MainScreen;
