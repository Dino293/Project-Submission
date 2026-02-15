import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import threadsReducer, { fetchThreads } from '../../store/slices/threadsSlice'
import api from '../../utils/api'

vi.mock('../../utils/api')

describe('threads thunks', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: { threads: threadsReducer },
    })
    vi.clearAllMocks()
  })

  it('should fetch threads successfully', async () => {
    const mockThreads = [
      { id: '1', title: 'Thread 1', body: 'Body 1', ownerId: 'u1', upVotesBy: [], downVotesBy: [] },
    ]
    const mockUsers = [{ id: 'u1', name: 'User 1', avatar: null }]

    api.get
      .mockResolvedValueOnce({ data: { data: { threads: mockThreads } } })
      .mockResolvedValueOnce({ data: { data: { users: mockUsers } } })

    await store.dispatch(fetchThreads())

    const state = store.getState().threads
    expect(state.threads).toHaveLength(1)
    expect(state.threads[0].owner).toBeDefined()
    expect(state.threads[0].owner.name).toBe('User 1')
    expect(state.loading).toBe(false)
  })

  it('should handle fetch threads failure', async () => {
    const errorMessage = 'Network error'
    api.get.mockRejectedValue({ response: { data: { message: errorMessage } } })

    await store.dispatch(fetchThreads())

    const state = store.getState().threads
    expect(state.threads).toHaveLength(0)
    expect(state.error).toBe(errorMessage)
    expect(state.loading).toBe(false)
  })
})
