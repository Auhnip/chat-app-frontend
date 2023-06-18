import React, { useCallback, useState } from 'react';
import { CreateGroupProps } from '../types/screenProps';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Headline,
  HelperText,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import { isValidGroupDescription, isValidGroupName } from '../utils/others';
import { useLockFn } from 'ahooks';
import LoadingOverlay from '../components/LoadingOverlay';
import groupApi from '../api/group';

const successHint = '创建成功' as const;
const failedHint = '创建失败' as const;

const CreateGroupScreen = ({ navigation }: CreateGroupProps) => {
  const [groupName, setGroupName] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');

  const [groupNameHintType, setGroupNameHintType] = useState<'error' | 'info'>(
    'error',
  );
  const [groupDescriptionHintType, setGroupDescriptionHintType] = useState<
    'error' | 'info'
  >('info');

  const [hintVisible, setHintVisible] = useState<boolean>(false);
  const [hint, setHint] = useState<typeof successHint | typeof failedHint>(
    successHint,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const onCreateGroup = useCallback(async () => {
    setLoading(true);

    try {
      if ([groupDescriptionHintType, groupNameHintType].includes('error')) {
        throw new Error('invalid input');
      }

      const { error } = await groupApi.createGroup(groupName, groupDescription);

      if (error) {
        throw error;
      }

      setGroupName('');
      setGroupDescription('');
      setHint(successHint);
    } catch (error) {
      setHint(failedHint);
    }

    setHintVisible(true);
    setLoading(false);
  }, [groupName, groupDescription]);

  return (
    <View style={styles.screen}>
      <LoadingOverlay visible={loading} />
      <Headline style={styles.title}>请填写需要创建的群信息~</Headline>
      <TextInput
        style={styles.input}
        label='群名称'
        value={groupName}
        onChangeText={(text) => {
          setGroupNameHintType(isValidGroupName(text) ? 'info' : 'error');
          setGroupName(text);
        }}
      />
      <HelperText type={groupNameHintType} style={styles.formatHint}>
        任意2~255位字符
      </HelperText>
      <TextInput
        style={styles.input}
        label='群描述'
        numberOfLines={5}
        multiline={true}
        value={groupDescription}
        onChangeText={(text) => {
          setGroupDescriptionHintType(
            isValidGroupDescription(text) ? 'info' : 'error',
          );
          setGroupDescription(text);
        }}
      />
      <HelperText type={groupDescriptionHintType} style={styles.formatHint}>
        任意0~255位字符
      </HelperText>

      <Button
        mode='outlined'
        icon='pencil-outline'
        style={styles.button}
        onPress={onCreateGroup}
      >
        创建
      </Button>
      <Snackbar
        visible={hintVisible}
        onDismiss={() => setHintVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        {hint}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    marginHorizontal: 32,
    marginVertical: 32,
  },
  input: {
    marginTop: 12,
    marginHorizontal: 32,
  },
  formatHint: {
    marginHorizontal: 32,
  },
  button: {
    marginHorizontal: 32,
    marginVertical: 48,
  },
});

export default CreateGroupScreen;
