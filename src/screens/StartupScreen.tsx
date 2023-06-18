/*
 * @Author       : wqph
 * @Date         : 2023-04-12 23:03:00
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-06-01 21:35:42
 * @FilePath     : \app-side\src\screens\StartupScreen.tsx
 * @Description  : App 启动界面
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StartupProps } from '../types/screenProps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { loadUserState } from '../store/userSlice';
import { useAsyncEffect } from 'ahooks';

const StartupScreen = ({ navigation }: StartupProps) => {
  const {
    colors: { primary },
  } = useTheme();

  const dispatch = useAppDispatch();

  /**
   * 查询 refreshToken，若有则尝试使用其进行登录
   */
  useAsyncEffect(async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (refreshToken === null) {
        throw new Error('No refresh token stored');
      }

      dispatch(loadUserState({ refreshToken }));
    } catch (error: any) {
      console.error(error);
      navigation.replace('Login');
    }
  }, [dispatch, navigation]);

  const { status, accessToken, error } = useAppSelector((state) => state.user);

  /**
   * 检查登录状态，进行相应操作
   */
  useAsyncEffect(async () => {
    try {
      if (status === 'success') {
        await AsyncStorage.setItem('accessToken', accessToken);
        navigation.replace('Main', { screen: 'ChatList' });
      } else if (status === 'failed') {
        throw error;
      }
    } catch (error) {
      console.log(error);
      navigation.replace('Login');
    }
  }, [status, error]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator animating={true} size={64} color={primary} />
      <Text style={styles.hint}>正在检查登录状态...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  hint: {
    marginTop: 32,
    textAlign: 'center',
  },
});
export default StartupScreen;
