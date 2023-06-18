/*
 * @Author       : wqph
 * @Date         : 2023-05-14 16:22:06
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-05-18 17:42:28
 * @FilePath     : \app-side\src\store\messageSlice.ts
 * @Description  : 消息记录状态管理
 */

import {
  Draft,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  GroupMessage,
  GroupMessageRecords,
  MessageRecords,
  PrivateMessage,
  PrivateMessageRecords,
  addMessageToRecords,
} from '../utils/messages';
import { RootState } from '.';
import { ChatTarget } from '../types';
import messageApi from '../api/message';

/**
 * messageSlice 的 state
 *
 * @interface MessageRecordsState
 */
interface MessageRecordsState {
  userId: string;
  messageRecords: MessageRecords;
  status: 'idle' | 'loading' | 'success' | 'failed';
  error: any;
}

const initialState: MessageRecordsState = {
  userId: 'unknown',
  messageRecords: [],
  status: 'idle',
  error: null,
};

const fetchMessageHistory = createAsyncThunk(
  'async/message',
  async (startBefore: number) => {
    const { data } = await messageApi.getHistoryMessages(startBefore);

    if (!data) {
      throw new Error('No returned message history');
    }

    return data;
  },
);

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<PrivateMessage | GroupMessage>,
    ) => {
      state.messageRecords = addMessageToRecords(
        state.userId,
        action.payload,
        state.messageRecords,
        true,
      );
    },
    clearMessageState: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMessageHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMessageHistory.fulfilled, (state, action) => {
        const { userId, messages } = action.payload;

        state.status = 'success';
        state.messageRecords = addMessageToRecords(userId, messages, [], false);
      })
      .addCase(fetchMessageHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

function selectMessageRecordsById(
  chatTarget: ChatTarget,
): (
  state: RootState,
) => PrivateMessageRecords | GroupMessageRecords | undefined {
  return (state: RootState) => {
    const messages = state.messages.messageRecords;

    if (chatTarget.type === 'group') {
      const records = messages.find(
        (record) =>
          record.type === 'group' && record.groupId === chatTarget.groupId,
      ) as GroupMessageRecords | undefined;
      return records;
    }

    const records = messages.find(
      (record) =>
        record.type === 'private' && record.userId === chatTarget.userId,
    ) as PrivateMessageRecords | undefined;
    return records;
  };
}

export const { addMessage, clearMessageState } = messageSlice.actions;

export { fetchMessageHistory };

export { selectMessageRecordsById };

export default messageSlice.reducer;
