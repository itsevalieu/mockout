import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders eva lieu in footer', () => {
  render(<Footer />);
  const footerElement = screen.getByText(/Eva Lieu/i);
  expect(footerElement).toBeInTheDocument();
});
