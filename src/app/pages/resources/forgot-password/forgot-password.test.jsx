import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ChplForgotPassword from './forgot-password';

import { setLoginState } from 'components/login/userInfo.slice';
import { goToState } from 'services/navigation.service';

const mockReduxDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockReduxDispatch,
}));
jest.mock('services/navigation.service', () => ({
  goToState: jest.fn(),
}));
jest.mock('components/login/login', () => function ChplLogin({ dispatch = () => {}, uuid }) {
  const mockReact = jest.requireActual('react');
  return mockReact.createElement('div', { 'data-testid': 'login', 'data-uuid': uuid }, [
    mockReact.createElement('button', { key: 'in', type: 'button', onClick: () => dispatch('loggedIn') }, 'Log in'),
    mockReact.createElement('button', { key: 'force', type: 'button', onClick: () => dispatch('forceChangePassword') }, 'Force change'),
  ]);
});

const UUID = 'reset-token';

describe('forgot password page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens on the reset form with the token from the link', () => {
    render(<ChplForgotPassword uuid={UUID} />);

    expect(mockReduxDispatch).toHaveBeenCalledWith(setLoginState('RESETFORGOTTENPASSWORD'));
    expect(screen.getByTestId('login')).toHaveAttribute('data-uuid', UUID);
    expect(goToState).not.toHaveBeenCalled();
  });

  it('shows the standard page header', () => {
    render(<ChplForgotPassword uuid={UUID} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Forgot Password' })).toBeInTheDocument();
  });

  it('goes to the home page once the user signs in after resetting', () => {
    render(<ChplForgotPassword uuid={UUID} />);
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(goToState).toHaveBeenCalledWith('search');
  });

  it('stays on the page for steps that are not a completed sign in', () => {
    render(<ChplForgotPassword uuid={UUID} />);
    fireEvent.click(screen.getByRole('button', { name: 'Force change' }));

    expect(goToState).not.toHaveBeenCalled();
  });
});
