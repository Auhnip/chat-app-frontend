import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import EmptyList from './EmptyList';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

interface ListScrollViewProps<ItemData> {
  getDataKey: (item: ItemData) => React.Key;
  fetchData: () => Promise<ItemData[]>;
  render: (item: ItemData) => JSX.Element;
  refreshRef?: MutableRefObject<(() => void) | undefined>;
}

const ListScrollView = <ItemData extends {}>({
  getDataKey,
  fetchData,
  render,
  refreshRef,
}: ListScrollViewProps<ItemData>) => {
  const [datas, setDatas] = useState<ItemData[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    (async () => {
      setRefreshing(true);
      const newData = await fetchData();
      setDatas(newData);
      setRefreshing(false);
    })();
  }, []);

  if (refreshRef) {
    refreshRef.current = onRefresh;
  }

  /**
   * 仅在用户切换到该界面时触发一次刷新
   */
  useFocusEffect(onRefresh);

  const dataList = useMemo(() => {
    return datas.map((data) => {
      const Item = () => render(data);
      return <Item key={getDataKey(data)} />;
    });
  }, [datas]);

  if (datas.length === 0) {
    return <EmptyList />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
    >
      {dataList}
    </ScrollView>
  );
};

export default ListScrollView;
