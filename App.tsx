import React from 'react';
import { StatusBar } from 'react-native';
import { AppProviders } from './src/app/providers/AppProviders';
import { RootNavigator } from './src/app/navigation/RootNavigator';

function App() {
  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </AppProviders>
  );
}

export default App;
