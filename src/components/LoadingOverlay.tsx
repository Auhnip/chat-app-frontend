import React from 'react';
import { ActivityIndicator, Modal, Portal, useTheme } from 'react-native-paper';

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay = (props: LoadingOverlayProps) => {
  const theme = useTheme();

  const { visible } = props;

  return (
    <Portal>
      <Modal visible={visible} dismissable={false}>
        <ActivityIndicator
          animating={true}
          color={theme.colors.primary}
          size={48}
        />
      </Modal>
    </Portal>
  );
};

export default LoadingOverlay;
