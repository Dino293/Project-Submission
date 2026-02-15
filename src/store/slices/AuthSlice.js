import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/register', { name, email, password })
      localStorage.setItem('token', response.data.data.token)
      return response.data.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', { email, password })
      localStorage.setItem('token', response.data.data.token)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const getOwnProfile = createAsyncThunk(
  'auth/getOwnProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/me')
      return response.data.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get profile')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getOwnProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(getOwnProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(getOwnProfile.rejected, (state) => {
        state.loading = false
        state.user = null
      })
  },
})

export const { logout, clearError, setUser } = authSlice.actions
export default authSlice.reducer
