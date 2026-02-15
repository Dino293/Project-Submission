// File: src/store/slices/commentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/threads/${threadId}/comments`, { content });
      return response.data.data.comment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const voteComment = createAsyncThunk(
  'comments/voteComment',
  async ({ threadId, commentId, voteType }, { rejectWithValue }) => {
    try {
      let endpoint;
      if (voteType === 1) endpoint = `/threads/${threadId}/comments/${commentId}/up-vote`;
      else if (voteType === -1) endpoint = `/threads/${threadId}/comments/${commentId}/down-vote`;
      else endpoint = `/threads/${threadId}/comments/${commentId}/neutral-vote`;

      const response = await api.post(endpoint);
      return {
        commentId,
        voteType,
        userId: response.data.data.vote.userId,
        threadId,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to vote comment');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(voteComment.pending, (state) => {
        state.error = null;
      })
      .addCase(voteComment.fulfilled, () => {
        // The actual update is handled in threadsSlice
      })
      .addCase(voteComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = commentsSlice.actions;
export default commentsSlice.reducer;
