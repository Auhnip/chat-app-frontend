
// 消息格式
interface MessageBase {
  from: string;
  content: string;
  sendAt: string;
}

export interface GroupMessage extends MessageBase {
  type: 'group';
  to: number;
}

export interface PrivateMessage extends MessageBase {
  type: 'private';
  to: string;
}

export interface GroupMessageRecords {
  type: 'group';
  groupId: number;
  records: GroupMessage[];
  lastMessage: GroupMessage;
}

export interface PrivateMessageRecords {
  type: 'private';
  userId: string;
  records: PrivateMessage[];
  lastMessage: PrivateMessage;
}

export type MessageRecords = (GroupMessageRecords | PrivateMessageRecords)[];


/**
 * 添加消息到消息记录中
 *
 * @param {string} userId
 * @param {(GroupMessage | PrivateMessage | (GroupMessage | PrivateMessage)[])} messages
 * @param {MessageRecords} allRecords
 * @param {boolean} shouldCopy
 * @return {*} 
 */
export const addMessageToRecords = (
  userId: string,
  messages: GroupMessage | PrivateMessage | (GroupMessage | PrivateMessage)[],
  allRecords: MessageRecords,
  shouldCopy: boolean,
) => {
  const newRecords = shouldCopy ? [...allRecords] : allRecords;

  if (!Array.isArray(messages)) {
    messages = [messages];
  }

  for (const message of messages) {
    // 群聊消息
    if (message.type === 'group') {
      const messageRecords = newRecords.find(
        (val) => val.type === 'group' && val.groupId === message.to,
      ) as GroupMessageRecords | undefined;

      // 若有对应的消息记录组
      if (messageRecords) {
        if (shouldCopy) {
          messageRecords.records = [...messageRecords.records, message];
        } else {
          messageRecords.records.push(message);
        }
        messageRecords.lastMessage = message;
        // 否则新建一个消息记录组
      } else {
        newRecords.push({
          type: 'group',
          groupId: message.to,
          records: [message],
          lastMessage: message,
        });
      }
      // 私聊消息
    } else {
      const messageRecords = newRecords.find(
        (val) =>
          val.type === 'private' &&
          (val.userId === message.to || val.userId === message.from),
      ) as PrivateMessageRecords | undefined;

      // 若有对应的消息记录组
      if (messageRecords) {
        if (shouldCopy) {
          messageRecords.records = [...messageRecords.records, message];
        } else {
          messageRecords.records.push(message);
        }
        messageRecords.lastMessage = message;
        // 否则新建一个消息记录组
      } else {
        newRecords.push({
          type: 'private',
          userId: message.to === userId ? message.from : message.to,
          records: [message],
          lastMessage: message,
        });
      }
    }
  }

  newRecords.sort(
    (lhs, rhs) =>
      new Date(rhs.lastMessage.sendAt).getTime() -
      new Date(lhs.lastMessage.sendAt).getTime(),
  );

  return newRecords;
};
