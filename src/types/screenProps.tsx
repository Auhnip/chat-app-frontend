import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Stack Navigation 的 Screen 的 params 列表
export type RootStackParamList = {
  Startup: undefined;
  Signup: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Chat:
    | { type: 'private'; userId: string }
    | { type: 'group'; groupId: number };
  GroupDetails: { groupId: number };
  UserDetails: { userId: string };
  Search: undefined;
  GroupRequestList: undefined;
  CreateGroup: undefined;
};

// 各个 Stack Screen 的 props
export type StartupProps = NativeStackScreenProps<
  RootStackParamList,
  'Startup'
>;

export type SignupProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export type MainProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

export type ChatProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export type GroupDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'GroupDetails'
>;

export type UserDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'UserDetails'
>;

export type SearchProps = NativeStackScreenProps<RootStackParamList, 'Search'>;

export type GroupRequestListProps = NativeStackScreenProps<
  RootStackParamList,
  'GroupRequestList'
>;

export type CreateGroupProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateGroup'
>;

// 在 MainScreen 中的 Tab Navigation 的 Screen 的 params 列表
export type MainTabParamList = {
  Friends: undefined;
  Groups: undefined;
  ChatList: undefined;
  Setting: undefined;
};

// MainScreen 中的各个 Tab Screen 的 props
export type FriendsProps = CompositeScreenProps<
  NativeStackScreenProps<MainTabParamList, 'Friends'>,
  MainProps
>;

export type GroupsProps = CompositeScreenProps<
  NativeStackScreenProps<MainTabParamList, 'Groups'>,
  MainProps
>;

export type ChatListProps = CompositeScreenProps<
  NativeStackScreenProps<MainTabParamList, 'ChatList'>,
  MainProps
>;

export type SettingProps = CompositeScreenProps<
  NativeStackScreenProps<MainTabParamList, 'Setting'>,
  MainProps
>;
