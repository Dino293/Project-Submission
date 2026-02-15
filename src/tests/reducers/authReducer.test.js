import { describe, it, expect } from 'vitest';
import authReducer, { logout, setUser } from '../../store/slices/AuthSlice';

describe('auth reducer', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle logout', () => {
    const previousState = {
      user: { id: '1', name: 'Test' },
      token: 'abc123',
      loading: false,
      error: null,
    };
    expect(authReducer(previousState, logout())).toEqual(initialState);
  });

  it('should handle setUser', () => {
    const user = { id: '1', name: 'Test' };
    expect(authReducer(initialState, setUser(user))).toEqual({
      ...initialState,
      user,
    });
  });
});
