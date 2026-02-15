import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchLeaderboards = createAsyncThunk(
  'leaderboards/fetchLeaderboards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaderboards')
      return response.data.data.leaderboards
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboards')
    }
  }
)

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    leaderboards: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.loading = false
        state.leaderboards = action.payload
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = leaderboardsSlice.actions
export default leaderboardsSlice.reducer
