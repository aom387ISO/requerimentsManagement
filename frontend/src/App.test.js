import { render, screen } from '@testing-library/react';
import App from './App';
import IniciarSesion from './iniciarSesion';

test('renders campos', () => {
  render(<IniciarSesion />);
  
  const userInput = screen.getByLabelText('Usuario:');
  expect(userInput).toBeInTheDocument();

  const passwordInput = screen.getByLabelText('Contraseña:');
  expect(passwordInput).toBeInTheDocument();
});
