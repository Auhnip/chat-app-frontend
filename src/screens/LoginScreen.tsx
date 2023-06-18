/*
 * @Author       : wqph
 * @Date         : 2023-04-06 00:16:22
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-06-03 01:54:17
 * @FilePath     : \app-side\src\screens\LoginScreen.tsx
 * @Description  : 登录界面
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LoginProps } from '../types/screenProps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  TextInput,
  Title,
  useTheme,
  Snackbar,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { loadUserState } from '../store/userSlice';

const LoginScreen = ({ navigation }: LoginProps) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [hintVisible, setHintVisible] = useState(false);

  const dispatch = useAppDispatch();

  const {
    status: loginStatus,
    refreshToken,
    accessToken,
    error,
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (loginStatus === 'failed') {
      setHintVisible(true);
      console.log(error);
    }

    if (loginStatus !== 'success') {
      return;
    }

    (async () => {
      try {
        await AsyncStorage.setItem('refreshToken', refreshToken);
        await AsyncStorage.setItem('accessToken', accessToken);

        navigation.replace('Main', { screen: 'ChatList' });
      } catch (error) {
        console.log(error);
        setHintVisible(true);
      }
    })();
  }, [loginStatus]);

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Title style={styles.title}>来进行登录操作叭~</Title>
        <TextInput
          style={styles.input}
          label='账号'
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          label='密码'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Button
          style={styles.button}
          onPress={() => dispatch(loadUserState({ userId, password }))}
          mode='contained'
        >
          登录
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('Signup')}
          mode='outlined'
        >
          注册
        </Button>
      </View>
      <Snackbar
        visible={hintVisible}
        onDismiss={() => setHintVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        登录失败
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    marginHorizontal: 32,
    marginVertical: 32,
  },
  input: {
    marginVertical: 12,
    marginHorizontal: 32,
  },
  button: {
    marginTop: 32,
    marginHorizontal: 48,
  },
});

export default LoginScreen;
