// File: src/store/slices/threadsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchUsers = createAsyncThunk('threads/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users');
    return response.data.data.users;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      // Ambil data threads
      const response = await api.get('/threads');
      const threads = response.data.data.threads;

      // Ambil data users jika belum ada di state
      const { users } = getState().threads;
      if (users.length === 0) {
        await dispatch(fetchUsers());
        const updatedState = getState();
        const allUsers = updatedState.threads.users;

        // Gabungkan data user dengan thread
        const threadsWithOwners = threads.map((thread) => {
          const owner = allUsers.find((user) => user.id === thread.ownerId);
          return {
            ...thread,
            owner: owner || {
              id: thread.ownerId,
              name: 'Unknown User',
              avatar: null,
            },
          };
        });

        return { threads: threadsWithOwners, users: allUsers };
      }

      // Jika users sudah ada, gabungkan data
      const threadsWithOwners = threads.map((thread) => {
        const owner = users.find((user) => user.id === thread.ownerId);
        return {
          ...thread,
          owner: owner || {
            id: thread.ownerId,
            name: 'Unknown User',
            avatar: null,
          },
        };
      });

      return { threads: threadsWithOwners, users };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
    }
  }
);

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchThreadDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/threads/${threadId}`);
      return response.data.data.detailThread;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch thread detail');
    }
  }
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async ({ title, body, category = 'General' }, { rejectWithValue }) => {
    try {
      const response = await api.post('/threads', { title, body, category });
      return response.data.data.thread;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create thread');
    }
  }
);

export const voteThread = createAsyncThunk(
  'threads/voteThread',
  async ({ threadId, voteType }, { rejectWithValue }) => {
    try {
      let endpoint;
      if (voteType === 1) endpoint = `/threads/${threadId}/up-vote`;
      else if (voteType === -1) endpoint = `/threads/${threadId}/down-vote`;
      else endpoint = `/threads/${threadId}/neutral-vote`;

      const response = await api.post(endpoint);
      return {
        threadId,
        voteType,
        userId: response.data.data.vote.userId,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to vote thread');
    }
  }
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    threads: [],
    users: [],
    threadDetail: null,
    loading: false,
    error: null,
    selectedCategory: 'all',
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearThreadDetail: (state) => {
      state.threadDetail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic vote untuk thread
    optimisticVoteThread: (state, action) => {
      const { threadId, voteType, userId } = action.payload;

      // Update di threads list
      state.threads = state.threads.map((thread) => {
        if (thread.id === threadId) {
          let newUpVotesBy = [...(thread.upVotesBy || [])];
          let newDownVotesBy = [...(thread.downVotesBy || [])];

          // Hapus vote sebelumnya
          newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
          newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);

          // Tambahkan vote baru
          if (voteType === 1) {
            newUpVotesBy.push(userId);
          } else if (voteType === -1) {
            newDownVotesBy.push(userId);
          }

          return {
            ...thread,
            upVotesBy: newUpVotesBy,
            downVotesBy: newDownVotesBy,
          };
        }
        return thread;
      });

      // Update di thread detail
      if (state.threadDetail && state.threadDetail.id === threadId) {
        let newUpVotesBy = [...(state.threadDetail.upVotesBy || [])];
        let newDownVotesBy = [...(state.threadDetail.downVotesBy || [])];

        // Hapus vote sebelumnya
        newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
        newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);

        // Tambahkan vote baru
        if (voteType === 1) {
          newUpVotesBy.push(userId);
        } else if (voteType === -1) {
          newDownVotesBy.push(userId);
        }

        state.threadDetail.upVotesBy = newUpVotesBy;
        state.threadDetail.downVotesBy = newDownVotesBy;
      }
    },
    // Optimistic vote untuk komentar (di threadsSlice karena komentar ada dalam threadDetail)
    optimisticVoteComment: (state, action) => {
      const { commentId, voteType, userId } = action.payload;

      if (state.threadDetail && state.threadDetail.comments) {
        state.threadDetail.comments = state.threadDetail.comments.map((comment) => {
          if (comment.id === commentId) {
            let newUpVotesBy = [...(comment.upVotesBy || [])];
            let newDownVotesBy = [...(comment.downVotesBy || [])];

            // Hapus vote sebelumnya
            newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
            newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);

            // Tambahkan vote baru
            if (voteType === 1) {
              newUpVotesBy.push(userId);
            } else if (voteType === -1) {
              newDownVotesBy.push(userId);
            }

            return {
              ...comment,
              upVotesBy: newUpVotesBy,
              downVotesBy: newDownVotesBy,
            };
          }
          return comment;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch threads
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload.threads;
        state.users = action.payload.users;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch thread detail
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.threadDetail = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create thread
      .addCase(createThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        // Tambahkan thread baru ke awal array
        state.threads.unshift(action.payload);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Vote thread
      .addCase(voteThread.fulfilled, (state, action) => {
        const { threadId, voteType, userId } = action.payload;

        // Update di threads list
        state.threads = state.threads.map((thread) => {
          if (thread.id === threadId) {
            let newUpVotesBy = [...(thread.upVotesBy || [])];
            let newDownVotesBy = [...(thread.downVotesBy || [])];

            // Hapus dari array yang berlawanan
            newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
            newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);

            // Tambahkan ke array yang sesuai
            if (voteType === 1) {
              newUpVotesBy.push(userId);
            } else if (voteType === -1) {
              newDownVotesBy.push(userId);
            }

            return {
              ...thread,
              upVotesBy: newUpVotesBy,
              downVotesBy: newDownVotesBy,
            };
          }
          return thread;
        });

        // Update di thread detail
        if (state.threadDetail && state.threadDetail.id === threadId) {
          let newUpVotesBy = [...(state.threadDetail.upVotesBy || [])];
          let newDownVotesBy = [...(state.threadDetail.downVotesBy || [])];

          // Hapus dari array yang berlawanan
          newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
          newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);

          // Tambahkan ke array yang sesuai
          if (voteType === 1) {
            newUpVotesBy.push(userId);
          } else if (voteType === -1) {
            newDownVotesBy.push(userId);
          }

          state.threadDetail.upVotesBy = newUpVotesBy;
          state.threadDetail.downVotesBy = newDownVotesBy;
        }
      });
  },
});

export const {
  setSelectedCategory,
  clearThreadDetail,
  optimisticVoteThread,
  optimisticVoteComment,
  clearError,
} = threadsSlice.actions;

export default threadsSlice.reducer;
