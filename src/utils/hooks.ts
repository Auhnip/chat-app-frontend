/*
 * @Author       : wqph
 * @Date         : 2023-05-14 16:28:09
 * @LastEditors  : wqph auhnipuiq@163.com
 * @LastEditTime : 2023-06-03 01:29:18
 * @FilePath     : \app-side\src\utils\hooks.ts
 * @Description  : 自定义类型的 hooks
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';
import { ChatTarget } from '../types';
import { useEffect, useState } from 'react';
import { groupIdToString } from './others';
import groupApi from '../api/group';
import { useAsyncEffect } from 'ahooks';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useChatTargetName = (chatTarget: ChatTarget) => {
  const [name, setName] = useState<string>(
    chatTarget.type === 'private'
      ? chatTarget.userId
      : groupIdToString(chatTarget.groupId),
  );

  useEffect(() => {
    if (chatTarget.type === 'private') {
      return;
    }

    (async () => {
      const { data, error } = await groupApi.getGroupDetails(
        chatTarget.groupId,
      );

      if (!data) {
        console.error(error);
        return;
      }

      setName(data.name);
    })();
  }, [chatTarget]);

  return name;
};

/**
 * 使用异步副作用函数，并返回一个布尔值表示该函数是否执行结束
 * 不能短时间频繁多次调用，否则 loading 状态不确定
 *
 * @param {() => Promise<void>} effect 副作用异步函数
 * @param {any[]} dependency 依赖数组
 * @return {boolean} 加载状态
 */
export const useLoadingAsyncEffect = (
  effect: () => Promise<void>,
  dependency: any[],
) => {
  const [loading, setLoading] = useState<boolean>(false);

  useAsyncEffect(async () => {
    setLoading(true);

    await effect();

    setLoading(false);
  }, dependency);

  return loading;
};
