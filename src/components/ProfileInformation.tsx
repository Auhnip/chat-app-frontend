import React, { useCallback } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  Avatar,
  Button,
  Headline,
  Caption,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import ImagePicker from 'react-native-image-crop-picker';

import defaultUserAvatar from '../assets/defaultUserAvatar.jpg';
import { Options } from 'react-native-image-crop-picker';
import userApi from '../api/user';
import { updateUserAvatar } from '../store/userSlice';

const pickerOptions: Options = {
  width: 400,
  height: 400,
  mediaType: 'photo',
  forceJpg: true,
  cropping: true,
};

interface ProfileInformationProps {
  style?: ViewStyle;
}

const ProfileInformation = ({ style }: ProfileInformationProps) => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.user.userId);
  const userAvatar = useAppSelector((state) => state.user.avatar);

  const userEmail = useAppSelector((state) => state.user.email);

  const changeAvatarPress = useCallback(async () => {
    try {
      const image = await ImagePicker.openPicker(pickerOptions);

      console.log(image);

      const { data, error } = await userApi.uploadAvatar({
        uri: image.path,
        type: image.mime,
        name: `${userId}.jpg`,
      });

      if (!data) {
        throw error;
      }

      dispatch(updateUserAvatar(data.avatar));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, userId]);

  return (
    <View style={[styles.information, style]}>
      <View style={styles.textInformationBox}>
        <Headline style={styles.userId}>{userId}</Headline>
        <Caption style={styles.userEmail}>{userEmail}</Caption>
      </View>
      <View style={styles.avatarBox}>
        <Avatar.Image
          size={100}
          source={userAvatar ? { uri: userAvatar } : defaultUserAvatar}
          style={styles.avatorImage}
        />
        <Button
          mode='contained-tonal'
          style={styles.avatarChangeButton}
          onPress={changeAvatarPress}
        >
          更换头像
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  information: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  textInformationBox: {
    padding: 16,
  },
  userId: {
    fontSize: 32,
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
  },
  avatarBox: {},
  avatorImage: {
    marginVertical: 8,
  },
  avatarChangeButton: {
    marginBottom: 8,
    transform: [{ scale: 0.8 }],
  },
});

export default ProfileInformation;
