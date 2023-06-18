import dateFormat from 'dateformat';
import { ChatTarget } from '../types';

const getRandomColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, '0');
  }

  return color;
};

const getFirstLetter = (chatTarget: ChatTarget) => {
  if (chatTarget.type === 'private') {
    const { userId } = chatTarget;
    let firstLetter = userId.length > 1 ? userId[0] : '?';
    return firstLetter.toUpperCase();
  }

  return (chatTarget.groupId % 10).toString().charAt(0);
};

const groupIdToString = (groupId: number) => {
  return groupId.toString().padStart(11, '0');
};

const chatTimeFormatter = (date: string | Date): string => {
  const today = new Date().getDate();

  if (typeof date === 'string') {
    date = new Date(date);
  }

  if (date.getDate() === today) {
    return dateFormat(date, 'HH:MM', false);
  }

  return dateFormat(date, 'yyyy-mm-dd');
};

const detailChatTimeFormatter = (date: string | Date): string => {
  const today = new Date().getDate();

  if (typeof date === 'string') {
    date = new Date(date);
  }

  if (date.getDate() !== today) {
    return dateFormat(date, 'yyyy-mm-dd HH:MM');
  }

  return dateFormat(date, 'HH:MM');
};

const isValidUserId = (text: string): boolean => {
  const length = text.length;
  return length <= 25 && length >= 2;
};

const isValidGroupId = (text: string): boolean => {
  const number = Number(text);
  return number > 0;
};

const isValidPassword = (text: string): boolean => {
  return /^[a-zA-Z0-9]{6,25}$/.test(text);
};

const isValidEmail = (text: string): boolean => {
  return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/.test(text);
};

const isValidGroupName = (text: string): boolean => {
  return text.length >= 2 && text.length <= 255;
};

const isValidGroupDescription = (text: string): boolean => {
  return text.length <= 255;
};

export {
  getRandomColor,
  getFirstLetter,
  groupIdToString,
  chatTimeFormatter,
  detailChatTimeFormatter,
  isValidUserId,
  isValidGroupId,
  isValidPassword,
  isValidEmail,
  isValidGroupName,
  isValidGroupDescription,
};
