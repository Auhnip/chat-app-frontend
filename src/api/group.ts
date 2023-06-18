import { GroupDetails } from '../types';
import { makeRequest } from '../utils/network';

const groupApi = {
  async getGroupDetails(groupId: number) {
    return await makeRequest<GroupDetails, { groupId: number }>({
      url: '/group/details',
      method: 'post',
      data: { groupId },
    });
  },

  async getSelfStatus(groupId: number) {
    return await makeRequest<
      { status: 'JOINED' | 'WAITING' | 'REJECTED' | null },
      { groupId: number }
    >({
      url: '/group/selfstatus',
      method: 'post',
      data: { groupId },
    });
  },

  async requestJoin(groupId: number) {
    return await makeRequest<undefined, { groupId: number }>({
      url: '/group/request',
      method: 'post',
      data: { groupId },
    });
  },

  async responseJoin(groupId: number, userId: string, isAgree: boolean) {
    return await makeRequest<
      undefined,
      { groupId: number; userId: string; isAgree: boolean }
    >({
      url: '/group/response',
      method: 'post',
      data: { groupId, userId, isAgree },
    });
  },

  async quitGroup(groupId: number) {
    return await makeRequest<undefined, { groupId: number }>({
      url: '/group/quit',
      method: 'post',
      data: { groupId },
    });
  },

  async getRequestList() {
    return await makeRequest<{
      list: {
        groupId: number;
        groupName: string;
        userId: string;
        requestTime: string;
      }[];
    }>({
      url: '/group/requestlist',
      method: 'get',
    });
  },

  async createGroup(groupName: string, groupDescription: string) {
    return await makeRequest<
      undefined,
      { groupName: string; groupDescription: string }
    >({
      url: '/group/create',
      method: 'post',
      data: {
        groupName,
        groupDescription,
      },
    });
  },
};

export default groupApi;
