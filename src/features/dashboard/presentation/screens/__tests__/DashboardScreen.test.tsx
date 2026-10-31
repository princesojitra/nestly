import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DashboardScreen } from '../DashboardScreen';
import { useAuthStore } from '../../../../authentication/presentation/useAuthStore';

const testMetrics = { insets: { top: 0, left: 0, right: 0, bottom: 0 }, frame: { x: 0, y: 0, width: 390, height: 844 } };

function renderScreen() {
  const navigate = jest.fn();
  const props = { navigation: { navigate } } as any;
  const { getByText } = render(
    <SafeAreaProvider initialMetrics={testMetrics}>
      <DashboardScreen {...props} />
    </SafeAreaProvider>,
  );
  return { getByText, navigate };
}

test('greets the signed-in user by the local part of their email', () => {
  useAuthStore.getState().setUser({ id: '1', email: 'jamie@example.com' });

  const { getByText } = renderScreen();

  expect(getByText('jamie')).toBeTruthy();
});

test('empty-state CTA navigates to the Inventory tab', () => {
  useAuthStore.getState().setUser({ id: '1', email: 'jamie@example.com' });

  const { getByText, navigate } = renderScreen();
  fireEvent.press(getByText('Add your first asset'));

  expect(navigate).toHaveBeenCalledWith('Inventory');
});
