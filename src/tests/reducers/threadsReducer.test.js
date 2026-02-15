import { describe, it, expect } from 'vitest';
import threadsReducer, { optimisticVoteThread } from '../../store/slices/threadsSlice';

describe('threads reducer', () => {
  const initialState = {
    threads: [],
    threadDetail: null,
    users: [],
    loading: false,
    error: null,
    selectedCategory: 'all',
  };

  it('should handle initial state', () => {
    expect(threadsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle optimisticVoteThread (upvote)', () => {
    const stateWithThread = {
      ...initialState,
      threads: [
        {
          id: 'thread-1',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
    };
    const action = {
      type: optimisticVoteThread.type,
      payload: { threadId: 'thread-1', voteType: 1, userId: 'user-1' },
    };
    const newState = threadsReducer(stateWithThread, action);
    expect(newState.threads[0].upVotesBy).toContain('user-1');
    expect(newState.threads[0].downVotesBy).not.toContain('user-1');
  });

  it('should handle optimisticVoteThread (neutralize)', () => {
    const stateWithUpvote = {
      ...initialState,
      threads: [
        {
          id: 'thread-1',
          upVotesBy: ['user-1'],
          downVotesBy: [],
        },
      ],
    };
    const action = {
      type: optimisticVoteThread.type,
      payload: { threadId: 'thread-1', voteType: 0, userId: 'user-1' },
    };
    const newState = threadsReducer(stateWithUpvote, action);
    expect(newState.threads[0].upVotesBy).not.toContain('user-1');
    expect(newState.threads[0].downVotesBy).not.toContain('user-1');
  });
});
