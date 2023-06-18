/*
 * @Author       : wqph
 * @Date         : 2023-04-12 01:57:45
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-06-04 11:28:36
 * @FilePath     : \app-side\src\api\user.ts
 * @Description  : 用户操作相关的 API
 */

import { UserRelation } from '../types';
import { makeRequest } from '../utils/network';

const userApi = {
  async userSignup(
    userId: string,
    password: string,
    email: string,
    code: string,
  ) {
    return await makeRequest<
      undefined,
      {
        userId: string;
        password: string;
        email: string;
        code: string;
        createdAt: Date;
      }
    >({
      url: '/signup',
      method: 'post',
      data: { userId, password, email, code, createdAt: new Date() },
    });
  },

  async sendVerificationCodeTo(email: string) {
    return await makeRequest<undefined, { email: string }>({
      url: '/signup/verify/email',
      method: 'post',
      data: { email },
    });
  },

  async userLogin(userId: string, password: string) {
    return await makeRequest<
      { accessToken: string; refreshToken: string },
      { userId: string; password: string }
    >({
      url: '/login',
      method: 'post',
      data: {
        userId,
        password,
      },
    });
  },

  async userDetails(userId: string, token?: string) {
    return await makeRequest<
      {
        userId: string;
        password: string;
        email: string;
        createdAt: string;
        avatar: string | null;
      },
      { userId: string }
    >({
      url: '/user/details',
      method: 'post',
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data: { userId },
    });
  },

  async getFriendsList() {
    return await makeRequest<{ userId: string; userAvatar: string | null }[]>({
      url: '/user/friends',
      method: 'get',
    });
  },

  async getGroupsList() {
    return await makeRequest<
      { groupId: number; groupName: string; groupAvatar: string | null }[]
    >({
      url: '/user/groups',
      method: 'get',
    });
  },

  async uploadAvatar(file: { uri: string; type: string; name: string }) {
    const formData = new FormData();

    formData.append('avatar', file);

    return await makeRequest<{ avatar: string }, FormData>({
      url: '/user/avatar/upload',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default userApi;
