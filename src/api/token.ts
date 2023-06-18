/*
 * @Author       : wqph
 * @Date         : 2023-04-13 18:18:30
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-05-18 10:35:11
 * @FilePath     : \app-side\src\api\token.ts
 * @Description  : token 操作相关的 API
 */

import { makeRequest } from '../utils/network';

const tokenRefresh = async (refreshToken: string) =>
  makeRequest<
    { userId: string; accessToken: string },
    { refreshToken: string }
  >({
    url: '/token/refresh',
    method: 'post',
    data: { refreshToken },
  });

export { tokenRefresh };
