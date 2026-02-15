import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { fetchThreadDetail, clearThreadDetail } from '../store/slices/threadsSlice'
import { getOwnProfile } from '../store/slices/AuthSlice'
import { formatDate } from '../utils/formatters'
import Loading from '../components/common/Loading'
import Navbar from '../components/common/Navbar'
import VoteButton from '../components/vote/VoteButton'
import CommentForm from '../components/comment/CommentForm'
import CommentList from '../components/comment/CommentList'

const ThreadDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { threadDetail, loading } = useSelector((state) => state.threads)
  const { user, token } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchThreadDetail(id))

    // Fetch user profile if token exists
    if (token) {
      dispatch(getOwnProfile())
    }

    return () => {
      dispatch(clearThreadDetail())
    }
  }, [dispatch, id, token])

  const getUserVote = () => {
    if (!user || !threadDetail) return 0
    if (threadDetail.upVotesBy.includes(user.id)) return 1
    if (threadDetail.downVotesBy.includes(user.id)) return -1
    return 0
  }

  if (loading) return <Loading fullScreen />
  if (!threadDetail) return null

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='container px-4 py-8 mx-auto'>
        {/* Back button */}
        <Link to='/' className='inline-flex items-center mb-6 text-blue-600 hover:text-blue-800'>
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            />
          </svg>
          Kembali ke Threads
        </Link>

        {/* Thread Content */}
        <div className='p-6 mb-8 bg-white rounded-lg shadow'>
          <div className='flex items-start space-x-4'>
            {/* Vote Section */}
            <div className='flex flex-col items-center'>
              <VoteButton
                type='thread'
                id={threadDetail.id}
                currentVote={getUserVote()}
                upVotes={threadDetail.upVotesBy.length}
                downVotes={threadDetail.downVotesBy.length}
              />
            </div>

            <div className='flex-1'>
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h1 className='mb-2 text-2xl font-bold text-gray-900'>{threadDetail.title}</h1>
                  <div className='flex items-center space-x-4'>
                    <span className='px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full'>
                      {threadDetail.category || 'General'}
                    </span>
                    <span className='text-sm text-gray-500'>
                      {formatDate(threadDetail.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='mb-6 prose max-w-none'>
                <p className='text-gray-700 whitespace-pre-line'>{threadDetail.body}</p>
              </div>

              {/* Author Info */}
              <div className='flex items-center justify-between pt-6 border-t'>
                <div className='flex items-center'>
                  <img
                    src={
                      threadDetail.owner?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        threadDetail.owner?.name || 'User'
                      )}&background=3b82f6&color=fff`
                    }
                    alt={threadDetail.owner?.name}
                    className='w-10 h-10 mr-3 rounded-full'
                  />
                  <div>
                    <p className='font-medium text-gray-900'>{threadDetail.owner?.name}</p>
                    <p className='text-sm text-gray-500'>Pembuat thread</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className='p-6 bg-white rounded-lg shadow'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold text-gray-900'>
              Komentar ({threadDetail.comments?.length || 0})
            </h2>
          </div>

          {/* Comment Form */}
          {token && <CommentForm threadId={id} />}

          {/* Comment List */}
          {threadDetail.comments && threadDetail.comments.length > 0 ? (
            <CommentList comments={threadDetail.comments} threadId={id} />
          ) : (
            <div className='py-8 text-center text-gray-500'>
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThreadDetailPage
