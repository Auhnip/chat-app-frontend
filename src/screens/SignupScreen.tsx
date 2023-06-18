import React, { useCallback, useState } from 'react';
import { SignupProps } from '../types/screenProps';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Headline,
  HelperText,
  Snackbar,
  TextInput,
  Title,
} from 'react-native-paper';
import { isValidEmail, isValidPassword, isValidUserId } from '../utils/others';
import userApi from '../api/user';
import { ReactReduxContext } from 'react-redux';

const sendEmailErrorMessage = '验证码发送失败';
const sendEmailSuccessMessage = '验证码发送成功';
const signupErrorMessage = '注册失败';
const signupSuccessMessage = '注册成功';

const SignupScreen = ({ navigation }: SignupProps) => {
  const [hintVisible, setHintVisible] = useState<boolean>(false);
  const [hint, setHint] = useState<string>(sendEmailErrorMessage);

  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');

  const [userIdHintType, setUserIdHintType] = useState<'info' | 'error'>(
    'error',
  );
  const [passwordHintType, setPasswordHintType] = useState<'info' | 'error'>(
    'error',
  );
  const [emailHintType, setEmailHintType] = useState<'info' | 'error'>('error');

  const sendVerificationCode = useCallback(async () => {
    if (!isValidEmail(email)) {
      setHint(sendEmailErrorMessage);
      setHintVisible(true);
      return;
    }

    const { error } = await userApi.sendVerificationCodeTo(email);

    if (error) {
      console.error(error);
      setHint(sendEmailErrorMessage);
    } else {
      setHint(sendEmailSuccessMessage);
    }
    setHintVisible(true);
  }, [email]);

  const toSignup = useCallback(async () => {
    if (
      [userIdHintType, passwordHintType, emailHintType].includes('error') ||
      verificationCode.trim() === ''
    ) {
      setHint(signupErrorMessage);
      setHintVisible(true);
      return;
    }

    const { error } = await userApi.userSignup(
      userId,
      password,
      email,
      verificationCode,
    );

    if (error) {
      console.error(error);
      setHint(signupErrorMessage);
    } else {
      setHint(signupSuccessMessage);
      // 清空表单
      setUserId('')
      setPassword('')
      setEmail('')
      setVerificationCode('')
    }
    setHintVisible(true);
  }, [
    userIdHintType,
    passwordHintType,
    emailHintType,
    verificationCode,
    userId,
    password,
    email,
    verificationCode,
  ]);

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Title style={styles.title}>注册</Title>
        <TextInput
          style={styles.input}
          label='账号'
          value={userId}
          onChangeText={(text) => {
            setUserIdHintType(isValidUserId(text) ? 'info' : 'error');
            setUserId(text);
          }}
        />
        <HelperText type={userIdHintType} style={styles.formatHint}>
          任意2~25位字符
        </HelperText>
        <TextInput
          style={styles.input}
          label='密码'
          value={password}
          onChangeText={(text) => {
            setPasswordHintType(isValidPassword(text) ? 'info' : 'error');
            setPassword(text);
          }}
          secureTextEntry={true}
        />
        <HelperText type={passwordHintType} style={styles.formatHint}>
          仅由大小写字母和数字组成的6~25位字符
        </HelperText>
        <TextInput
          style={styles.input}
          label='邮箱'
          value={email}
          onChangeText={(text) => {
            setEmailHintType(isValidEmail(text) ? 'info' : 'error');
            setEmail(text);
          }}
        />
        <HelperText type={emailHintType} style={styles.formatHint}>
          合法的邮箱地址格式
        </HelperText>
        <TextInput
          style={styles.input}
          label='验证码'
          value={verificationCode}
          onChangeText={setVerificationCode}
        />
        <Button
          mode='outlined'
          style={styles.button}
          onPress={sendVerificationCode}
        >
          发送验证码
        </Button>
        <Button mode='contained' style={styles.button} onPress={toSignup}>
          注册
        </Button>
      </View>
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
  content: {
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
    marginTop: 32,
    marginHorizontal: 48,
  },
});

export default SignupScreen;
