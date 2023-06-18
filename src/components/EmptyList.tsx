import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EmptyListProps {
  expand?: boolean;
}

const EmptyList = (props: EmptyListProps) => {
  const { expand = true } = props;

  return (
    <View style={[styles.screen, expand && { flex: 1 }]}>
      <MaterialIcon name='emoticon-confused-outline' size={48} />
      <Caption style={styles.hint}>当前列表为空</Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    marginTop: 8,
  },
});

export default EmptyList;
