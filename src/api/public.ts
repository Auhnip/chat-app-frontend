import { ChatTarget } from '../types';
import { makeRequest } from '../utils/network';

const publicApi = {
  async getUserAvatar(userId: string) {
    return await makeRequest<{ avatar: string | null }, { userId: string }>({
      url: '/public/avatar/user',
      method: 'post',
      data: { userId },
    });
  },

  async getGroupAvatar(groupId: number) {
    return await makeRequest<{ avatar: string | null }, { groupId: number }>({
      url: '/public/avatar/group',
      method: 'post',
      data: { groupId },
    });
  },

  async getAvatar(chatTarget: ChatTarget) {
    if (chatTarget.type === 'private') {
      return await this.getUserAvatar(chatTarget.userId);
    }

    return await this.getGroupAvatar(chatTarget.groupId);
  },
};

export default publicApi;
