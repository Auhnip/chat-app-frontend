import { UserRelation } from '../types';
import { makeRequest } from '../utils/network';

const FriendsApi = {
  async userRelationWith(others: string) {
    return await makeRequest<{ relation: UserRelation }, { others: string }>({
      url: '/friends/relation',
      method: 'post',
      data: { others },
    });
  },

  async requestFor(others: string) {
    return await makeRequest<undefined, { others: string }>({
      url: '/friends/request',
      method: 'post',
      data: { others },
    });
  },

  async responseFor(others: string, response: 'REJECTED' | 'AGREED') {
    return await makeRequest<
      undefined,
      { others: string; response: 'REJECTED' | 'AGREED' }
    >({
      url: '/friends/response',
      method: 'post',
      data: { others, response },
    });
  },

  async deleteFriend(others: string) {
    return await makeRequest<undefined, { others: string }>({
      url: '/friends/delete',
      method: 'post',
      data: { others },
    });
  },
};

export default FriendsApi;
