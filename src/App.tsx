import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StateProvider } from 'react-redux';
import appStore from './store';
import AppContent from './AppContent';


export default function App() {

  return (
    <StateProvider store={appStore}>
      <PaperProvider theme={{ version: 3 }}>
        <AppContent />
      </PaperProvider>
    </StateProvider>
  );
}
