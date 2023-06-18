/*
 * @Author       : wqph
 * @Date         : 2023-05-12 23:26:02
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-05-18 10:56:33
 * @FilePath     : \app-side\src\api\message.ts
 * @Description  : 消息收发相关的 API
 */

import { ChatTarget } from '../types';
import { GroupMessage, PrivateMessage } from '../utils/messages';
import { makeRequest } from '../utils/network';

const messageApi = {
  async getHistoryMessages(startBefore: number) {
    return await makeRequest<
      { userId: string; messages: (PrivateMessage | GroupMessage)[] },
      { startBefore: number }
    >({ url: '/message/history', method: 'post', data: { startBefore } });
  },

  async sendPrivateMessage(to: string, content: string) {
    return await makeRequest<
      undefined,
      {
        type: 'private';
        to: string;
        sendAt: Date;
        content: string;
      }
    >({
      url: '/message/send',
      method: 'post',
      data: { to, content, type: 'private', sendAt: new Date() },
    });
  },

  async sendGroupMessage(to: number, content: string) {
    return await makeRequest<
      undefined,
      {
        type: 'group';
        to: number;
        sendAt: Date;
        content: string;
      }
    >({
      url: '/message/send',
      method: 'post',
      data: { to, content, type: 'group', sendAt: new Date() },
    });
  },

  async sendMessage(chatTarget: ChatTarget, content: string) {
    return chatTarget.type === 'private'
      ? await this.sendPrivateMessage(chatTarget.userId, content)
      : await this.sendGroupMessage(chatTarget.groupId, content);
  },
};

export default messageApi;
