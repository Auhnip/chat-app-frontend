/*
 * @Author       : wqph
 * @Date         : 2023-05-18 21:37:54
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-06-05 01:03:45
 * @FilePath     : \app-side\src\AppContent.tsx
 * @Description  : APP 的内容根组件
 */

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { RootStackParamList } from './types/screenProps';
import StartupScreen from './screens/StartupScreen';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';
import MainScreen from './screens/MainScreen';
import { useColorScheme } from 'react-native';
import UserDetailsScreen from './screens/UserDetailsScreen';
import GroupDetailsScreen from './screens/GroupDetailsScreen';
import SearchScreen from './screens/SearchScreen';
import SignupScreen from './screens/SignupScreen';
import GroupRequestListScreen from './screens/GroupRequestListScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  // 获取 react-native-paper 的主题设置
  const theme = useTheme();

  // 获取当前设备主题状态（亮色或暗色）
  const schema = useColorScheme();

  // 根据 react-native-paper 的主题设置，更改 react-navigation 的暗色主题
  const darkNavigationTheme: NavigationTheme = useMemo(
    () => ({
      dark: true,
      colors: {
        ...DarkTheme.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
      },
    }),
    [theme],
  );

  // 根据 react-native-paper 的主题设置，更改 react-navigation 的亮色主题
  const lightNavigationTheme: NavigationTheme = useMemo(
    () => ({
      dark: false,
      colors: {
        ...DefaultTheme.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
      },
    }),
    [theme],
  );

  return (
    <NavigationContainer
      theme={schema === 'dark' ? darkNavigationTheme : lightNavigationTheme}
    >
      <Stack.Navigator
        initialRouteName='Startup'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Startup' component={StartupScreen} />
        <Stack.Screen name='Signup' component={SignupScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Main' component={MainScreen} />
        <Stack.Screen name='Chat' component={ChatScreen} />
        <Stack.Screen name='UserDetails' component={UserDetailsScreen} />
        <Stack.Screen name='GroupDetails' component={GroupDetailsScreen} />
        <Stack.Screen name='Search' component={SearchScreen} />
        <Stack.Screen
          name='GroupRequestList'
          component={GroupRequestListScreen}
        />
        <Stack.Screen name='CreateGroup' component={CreateGroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContent;
