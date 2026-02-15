import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser } from '../../store/slices/AuthSlice';
import api from '../../utils/api';

vi.mock('../../utils/api');

describe('auth thunks', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
    });
    vi.clearAllMocks();
  });

  it('should login successfully', async () => {
    const mockResponse = {
      data: {
        data: {
          token: 'fake-token',
          user: { id: '1', name: 'Test' },
        },
      },
    };
    api.post.mockResolvedValue(mockResponse);

    await store.dispatch(loginUser({ email: 'test@test.com', password: 'password' }));

    const state = store.getState().auth;
    expect(state.token).toBe('fake-token');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('should handle login failure', async () => {
    const errorMessage = 'Invalid credentials';
    api.post.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    await store.dispatch(loginUser({ email: 'test@test.com', password: 'wrong' }));

    const state = store.getState().auth;
    expect(state.token).toBeNull();
    expect(state.error).toBe(errorMessage);
    expect(state.loading).toBe(false);
  });
});
