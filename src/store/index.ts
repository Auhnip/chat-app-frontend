/*
 * @Author       : wqph
 * @Date         : 2023-05-14 16:20:51
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-05-15 00:31:31
 * @FilePath     : \app-side\src\store\index.ts
 * @Description  : 全局状态存储
 */

import { configureStore } from '@reduxjs/toolkit';

import userReducer from './userSlice';
import messageReducer from './messageSlice';

const appStore = configureStore({
  reducer: {
    user: userReducer,
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;

export type AppDispatch = typeof appStore.dispatch;

export default appStore;
