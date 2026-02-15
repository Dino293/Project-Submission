import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { formatDate } from '../../utils/formatters'
import VoteButton from '../vote/VoteButton'
import CommentForm from '../comment/CommentForm'
import CommentList from '../comment/CommentList'
import Button from '../common/Button'
import { toggleThreadForm } from '../../store/slices/uiSlice'

const ThreadDetail = ({ thread, onBack }) => {
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.threads)

  const getUserVote = () => {
    if (!user || !thread) return 0
    if (thread.upVotesBy?.includes(user.id)) return 1
    if (thread.downVotesBy?.includes(user.id)) return -1
    return 0
  }

  const handleCreateThread = () => {
    dispatch(toggleThreadForm())
  }

  if (loading || !thread) {
    return (
      <div className='flex justify-center py-12'>
        <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Back Button */}
      <div className='mb-6'>
        {onBack ? (
          <button
            onClick={onBack}
            className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium'
          >
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Kembali ke Daftar Thread
          </button>
        ) : (
          <Link
            to='/'
            className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium'
          >
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Kembali ke Daftar Thread
          </Link>
        )}
      </div>

      {/* Thread Content */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-8'>
        <div className='p-6 md:p-8'>
          <div className='flex items-start space-x-6'>
            {/* Vote Section */}
            <div className='flex flex-col items-center'>
              <VoteButton
                type='thread'
                id={thread.id}
                currentVote={getUserVote()}
                upVotes={thread.upVotesBy?.length || 0}
                downVotes={thread.downVotesBy?.length || 0}
              />
              <div className='mt-2 text-center'>
                <div className='text-sm font-semibold text-gray-900'>
                  {(thread.upVotesBy?.length || 0) - (thread.downVotesBy?.length || 0)} votes
                </div>
                <div className='text-xs text-gray-500'>{thread.totalComments || 0} komentar</div>
              </div>
            </div>

            {/* Content Section */}
            <div className='flex-1'>
              {/* Category Badge */}
              <div className='mb-4'>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                  {thread.category || 'Umum'}
                </span>
              </div>

              {/* Title */}
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>{thread.title}</h1>

              {/* Author Info */}
              <div className='flex items-center mb-6'>
                <div className='flex items-center'>
                  <img
                    src={
                      thread.owner?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.owner?.name || 'User')}&background=3b82f6&color=fff`
                    }
                    alt={thread.owner?.name}
                    className='w-10 h-10 rounded-full mr-3'
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.owner?.name || 'User')}&background=3b82f6&color=fff`
                    }}
                  />
                  <div>
                    <div className='font-medium text-gray-900'>{thread.owner?.name}</div>
                    <div className='text-sm text-gray-500'>
                      {formatDate(thread.createdAt)} • {thread.totalComments || 0} komentar
                    </div>
                  </div>
                </div>
              </div>

              {/* Thread Body */}
              <div className='prose prose-lg max-w-none mb-8'>
                <div className='whitespace-pre-line text-gray-700 leading-relaxed'>
                  {thread.body}
                </div>
              </div>

              {/* Thread Stats */}
              <div className='flex items-center justify-between border-t border-gray-200 pt-6'>
                <div className='flex items-center space-x-6'>
                  <div className='flex items-center space-x-2'>
                    <svg className='w-5 h-5 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className='text-gray-700 font-medium'>
                      {thread.upVotesBy?.length || 0}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <svg className='w-5 h-5 text-red-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className='text-gray-700 font-medium'>
                      {thread.downVotesBy?.length || 0}
                    </span>
                  </div>
                </div>

                {user?.id === thread.owner?.id && (
                  <div className='text-sm text-gray-500'>Thread milik Anda</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className='p-6 md:p-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold text-gray-900'>
              Komentar ({thread.comments?.length || 0})
            </h2>
            {!token && (
              <Button variant='outline' size='sm' onClick={() => (window.location.href = '/login')}>
                Login untuk Berkomentar
              </Button>
            )}
          </div>

          {/* Comment Form */}
          {token && <CommentForm threadId={thread.id} />}

          {/* Comments List */}
          <div className='mt-8'>
            <CommentList comments={thread.comments || []} threadId={thread.id} />
          </div>
        </div>
      </div>

      {/* Create Thread CTA */}
      {!token && (
        <div className='mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Ingin berdiskusi lebih banyak?
          </h3>
          <p className='text-gray-600 mb-4'>
            Bergabunglah dengan komunitas kami dan mulailah membuat thread Anda sendiri!
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button variant='primary' onClick={() => (window.location.href = '/register')}>
              Daftar Sekarang
            </Button>
            <Button variant='outline' onClick={() => (window.location.href = '/login')}>
              Login
            </Button>
          </div>
        </div>
      )}

      {token && (
        <div className='mt-8 flex justify-center'>
          <Button variant='primary' onClick={handleCreateThread} className='flex items-center'>
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
            Buat Thread Baru
          </Button>
        </div>
      )}
    </div>
  )
}

ThreadDetail.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
    totalComments: PropTypes.number,
    comments: PropTypes.array,
  }).isRequired,
  onBack: PropTypes.func,
}

export default ThreadDetail
