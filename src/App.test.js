import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders yukicoder problems link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/yukicoder problems/i);
  expect(linkElement).toBeInTheDocument();
});
