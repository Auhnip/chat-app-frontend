/*
 * @Author       : wqph
 * @Date         : 2023-05-14 17:02:52
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-05-29 20:22:37
 * @FilePath     : \app-side\src\store\userSlice.ts
 * @Description  : 用户状态管理
 */

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tokenRefresh } from '../api/token';
import userApi from '../api/user';

/**
 * userSlice 的状态
 *
 * @interface UserState
 */
interface UserState {
  userId: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  createdAt: string;
  avatar: string | null;
  status: 'idle' | 'loading' | 'success' | 'failed';
  error: any;
}

/**
 * userSlice 的初始状态
 */
const initialState: UserState = {
  userId: '',
  accessToken: '',
  refreshToken: '',
  email: '',
  createdAt: '',
  avatar: null,
  status: 'idle',
  error: null,
};

/**
 * 使用 ID 和密码登录时需要的参数
 *
 * @interface NormalLoginParams
 */
interface NormalLoginParams {
  userId: string;
  password: string;
}

/**
 * 使用 token 登录需要的参数
 *
 * @interface TokenLoginParams
 */
interface TokenLoginParams {
  refreshToken: string;
}

/**
 * 登录操作所需要的参数
 */
type LoginParams = NormalLoginParams | TokenLoginParams;

/**
 * 进行登录操作获取 token
 *
 * @param {LoginParams} params 登录所需的 { refreshToken } 或者 { userId, password }
 * @return {Promise<{ userId: string; accessToken: string; refreshToken: string }>}
 */
const getTokens = async (
  params: LoginParams,
): Promise<{ userId: string; accessToken: string; refreshToken: string }> => {
  if ('refreshToken' in params) {
    const { refreshToken } = params;
    const { data, error } = await tokenRefresh(refreshToken);

    if (!data) {
      throw error;
    }

    return { ...data, refreshToken };
  }

  const { userId, password } = params;

  const { data, error } = await userApi.userLogin(userId, password);

  if (!data) {
    throw error;
  }

  return { ...data, userId };
};

const loadUserState = createAsyncThunk(
  'async/user',
  async (params: LoginParams) => {
    const { userId, ...tokens } = await getTokens(params);

    const { data, error } = await userApi.userDetails(
      userId,
      tokens.accessToken,
    );

    if (!data) {
      throw error;
    }

    return { ...data, ...tokens };
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState: () => {
      return initialState;
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadUserState.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(loadUserState.fulfilled, (_, { payload }) => ({
        ...payload,
        error: null,
        status: 'success',
      }))
      .addCase(loadUserState.rejected, (state, action) => {
        state.error = action.error;
        state.status = 'failed';
      });
  },
});

export const { clearUserState, updateUserAvatar } = userSlice.actions;

export { loadUserState };

export default userSlice.reducer;
