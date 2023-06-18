/*
 * @Author       : wqph
 * @Date         : 2023-05-14 01:38:03
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-06-05 01:04:16
 * @FilePath     : \app-side\src\screens\MainTabScreens\SettingScreen.tsx
 * @Description  : 主页面中的设置页面
 */

import React, { useCallback } from 'react';
import { SettingProps } from '../../types/screenProps';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, useTheme } from 'react-native-paper';
import { useAppDispatch } from '../../utils/hooks';
import { clearUserState } from '../../store/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileInformation from '../../components/ProfileInformation';
import { clearMessageState } from '../../store/messageSlice';

const SettingScreen = ({ navigation }: SettingProps) => {
  const dispatch = useAppDispatch();

  const cancelLogin = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    } catch (error) {
      console.log(error);
    }

    dispatch(clearUserState());
    dispatch(clearMessageState());

    navigation.replace('Login');
  }, [navigation, dispatch]);

  return (
    <View style={styles.screen}>
      <ProfileInformation />
      <Divider style={styles.divider} />
      <View style={styles.buttonRow}>
        <Button
          mode='outlined'
          style={styles.buttonInRow}
          icon='bell-outline'
          onPress={() => navigation.navigate('GroupRequestList')}
        >
          管理入群申请
        </Button>
        <Button
          mode='contained-tonal'
          style={styles.buttonInRow}
          icon='pencil'
          onPress={() => navigation.navigate('CreateGroup')}
        >
          创建群
        </Button>
      </View>
      <Button
        style={styles.optionsButton}
        mode='outlined'
        onPress={cancelLogin}
      >
        退出登录
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  divider: {
    marginBottom: 16,
  },
  information: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonRow: {
    marginVertical: 16,
    flexDirection: 'row',
  },
  buttonInRow: {
    marginHorizontal: 16,
    flex: 1,
  },
  optionsButton: {
    margin: 16,
  },
});

export default SettingScreen;
