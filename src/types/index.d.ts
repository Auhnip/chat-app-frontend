export type PrivateChatTarget = { type: 'private'; userId: string };

export type GroupChatTarget = {
  type: 'group';
  groupId: number;
};

export type ChatTarget = PrivateChatTarget | GroupChatTarget;

export interface GroupDetails {
  groupId: number;
  name: string;
  description: string | null;
  owner: string;
  createdAt: Date;
  avatar: string | null;
}

export interface UserDetails {
  userId: string;
  password: string;
  email: string;
  createdAt: string;
  avatar: string | null;
}

export type UserRelation =
  | 'Stranger' // 陌生人
  | 'Requested' // 已向对方发送好友申请
  | 'Pending' // 收到对方的好友申请还未回复
  | 'Rejected' // 向对方发送了好友申请但被拒绝
  | 'Declined' // 拒绝了对方的好友申请
  | 'Accepted'; // 已成为好友
