import { render, screen } from '@testing-library/react';
import Hero from './Hero';

test('renders mockout.io header', () => {
  render(<Hero />);
  const headerElement = screen.getByText(/mockout.io/i);
  expect(headerElement).toBeInTheDocument();
});
