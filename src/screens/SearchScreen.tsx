import React, { useCallback, useState } from 'react';
import { SearchProps } from '../types/screenProps';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Headline,
  HelperText,
  Searchbar,
  Text,
} from 'react-native-paper';
import { isValidGroupId, isValidUserId } from '../utils/others';

const invalidUserIdHint = '请输入正确格式的用户 ID';
const invalidGroupIdHint = '请输入正确格式的群聊 ID';

const SearchScreen = ({ navigation }: SearchProps) => {
  const [searchText, setSearchText] = useState<string>('');
  const [hint, setHint] = useState<string>(invalidUserIdHint);
  const [hintVisible, setHintVisible] = useState<boolean>(false);

  const searchUser = useCallback(() => {
    if (!isValidUserId(searchText)) {
      setHint(invalidUserIdHint);
      setHintVisible(true);
      return;
    }

    setHintVisible(false);
    navigation.navigate('UserDetails', { userId: searchText });
  }, [searchText]);

  const searchGroup = useCallback(() => {
    if (!isValidGroupId(searchText)) {
      setHint(invalidGroupIdHint);
      setHintVisible(true);
      return;
    }

    setHintVisible(false);
    navigation.navigate('GroupDetails', { groupId: Number(searchText) });
  }, [searchText]);

  return (
    <View style={styles.screen}>
      <Headline style={styles.title}>查找用户/群聊</Headline>
      <Searchbar
        placeholder='User/Group ID'
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        style={styles.searchbar}
      />
      <HelperText type='error' visible={hintVisible} style={styles.hint}>
        {hint}
      </HelperText>
      <View style={styles.buttonbar}>
        <Button mode='outlined' onPress={searchUser}>
          查询用户
        </Button>
        <Button mode='contained' onPress={searchGroup}>
          查询群聊
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  searchbar: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  hint: {
    textAlign: 'center',
  },
  buttonbar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 16,
    marginTop: 32,
  },
});

export default SearchScreen;
