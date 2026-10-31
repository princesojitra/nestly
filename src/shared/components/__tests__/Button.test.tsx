import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

test('renders the label and fires onPress', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button label="Log maintenance" onPress={onPress} />);

  fireEvent.press(getByText('Log maintenance'));

  expect(onPress).toHaveBeenCalledTimes(1);
});
