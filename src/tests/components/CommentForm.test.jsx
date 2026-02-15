import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CommentForm from '../../components/comment/CommentForm'
import commentsReducer from '../../store/slices/commentsSlice'
import authReducer from '../../store/slices/AuthSlice'

vi.mock('../../store/slices/commentsSlice', async () => {
  const actual = await vi.importActual('../../store/slices/commentsSlice')
  return {
    ...actual,
    createComment: vi.fn(),
  }
})
import { createComment } from '../../store/slices/commentsSlice'

describe('CommentForm', () => {
  let store
  let user

  beforeEach(() => {
    vi.clearAllMocks()
    user = userEvent.setup()
  })

  it('should show login link and disabled button when user is not logged in', () => {
    store = configureStore({
      reducer: {
        comments: commentsReducer,
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          loading: false,
          error: null,
        },
      },
    })

    render(
      <Provider store={store}>
        <CommentForm threadId='thread-1' />
      </Provider>
    )

    const loginLink = screen.getByRole('link', { name: /login/i })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')

    const submitButton = screen.getByRole('button', { name: /Kirim Komentar/i })
    expect(submitButton).toBeDisabled()
  })

  it('should call createComment with correct data when form is submitted', async () => {
    store = configureStore({
      reducer: {
        comments: commentsReducer,
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: { id: '1', name: 'Test User' },
          token: 'fake',
          loading: false,
          error: null,
        },
      },
    })

    const mockUnwrap = vi.fn().mockResolvedValue({})
    createComment.mockReturnValue({ unwrap: mockUnwrap })

    render(
      <Provider store={store}>
        <CommentForm threadId='thread-1' />
      </Provider>
    )

    const textarea = screen.getByPlaceholderText(/Tulis komentar Anda di sini/i)
    await user.type(textarea, 'Valid comment')

    const submitButton = screen.getByRole('button', { name: /Kirim Komentar/i })
    expect(submitButton).not.toBeDisabled()

    await user.click(submitButton)

    await waitFor(() => {
      expect(createComment).toHaveBeenCalledWith({
        threadId: 'thread-1',
        content: 'Valid comment',
      })
    })
  })
})
