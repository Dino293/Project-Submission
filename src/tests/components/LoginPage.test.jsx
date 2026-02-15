import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../../pages/LoginPage';
import authReducer from '../../store/slices/AuthSlice';

vi.mock('../../store/slices/AuthSlice', async () => {
  const actual = await vi.importActual('../../store/slices/AuthSlice');
  return {
    ...actual,
    loginUser: vi.fn(),
    clearError: vi.fn(() => ({ type: 'MOCK_CLEAR_ERROR' })), // ✅ mengembalikan action object dummy
  };
});
import { loginUser, clearError } from '../../store/slices/AuthSlice';

describe('LoginPage', () => {
  let store;
  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  it('should display error message from Redux state', async () => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          loading: false,
          error: 'Invalid credentials',
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    // Error tetap tampil karena mock clearError tidak menghapusnya
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should call loginUser with correct credentials when form is submitted', async () => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    });

    const mockUnwrap = vi.fn().mockResolvedValue({});
    loginUser.mockReturnValue({ unwrap: mockUnwrap });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /Masuk/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });
  });
});
