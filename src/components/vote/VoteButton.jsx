import { useDispatch, useSelector } from 'react-redux'
import {
  voteThread,
  optimisticVoteThread,
  optimisticVoteComment,
} from '../../store/slices/threadsSlice'
import { voteComment } from '../../store/slices/commentsSlice'

const VoteButton = ({ type, id, threadId, currentVote, upVotes, downVotes }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.threads)

  const handleVote = async (voteType) => {
    if (!user) {
      alert('Silakan login untuk melakukan vote')
      return
    }

    // Jika mengklik vote yang sama, neutralkan
    const newVoteType = currentVote === voteType ? 0 : voteType

    if (type === 'thread') {
      // Optimistic update untuk thread
      dispatch(
        optimisticVoteThread({
          threadId: id,
          voteType: newVoteType,
          userId: user.id,
        })
      )

      try {
        await dispatch(voteThread({ threadId: id, voteType: newVoteType })).unwrap()
      } catch (error) {
        // Rollback jika gagal
        dispatch(
          optimisticVoteThread({
            threadId: id,
            voteType: currentVote,
            userId: user.id,
          })
        )
        console.error('Failed to vote thread:', error)
      }
    } else if (type === 'comment') {
      // Optimistic update untuk komentar
      dispatch(
        optimisticVoteComment({
          commentId: id,
          voteType: newVoteType,
          userId: user.id,
        })
      )

      try {
        await dispatch(
          voteComment({
            threadId,
            commentId: id,
            voteType: newVoteType,
          })
        ).unwrap()
      } catch (error) {
        // Rollback jika gagal
        dispatch(
          optimisticVoteComment({
            commentId: id,
            voteType: currentVote,
            userId: user.id,
          })
        )
        console.error('Failed to vote comment:', error)
      }
    }
  }

  const getVoteCount = () => {
    return (upVotes || 0) - (downVotes || 0)
  }

  return (
    <div className='flex items-center space-x-2'>
      {/* Upvote/Like Button */}
      <button
        onClick={() => handleVote(1)}
        disabled={loading || !user}
        className={`
          flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-200
          ${
            currentVote === 1
              ? 'text-white bg-blue-500 shadow-md'
              : 'text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-600'
          }
          ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={user ? 'Suka' : 'Login untuk menyukai'}
      >
        {/* Like/Thumbs Up Icon */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z' />
        </svg>
        <span className='text-sm font-medium'>{upVotes || 0}</span>
      </button>

      {/* Vote Count Separator (Optional) */}
      <div className='text-gray-400'>|</div>

      {/* Downvote/Dislike Button */}
      <button
        onClick={() => handleVote(-1)}
        disabled={loading || !user}
        className={`
          flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-200
          ${
            currentVote === -1
              ? 'text-white bg-red-500 shadow-md'
              : 'text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600'
          }
          ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={user ? 'Tidak Suka' : 'Login untuk tidak menyukai'}
      >
        {/* Dislike/Thumbs Down Icon */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z' />
        </svg>
        <span className='text-sm font-medium'>{downVotes || 0}</span>
      </button>

      {/* Total Votes Display (Net Score) */}
      <div className='ml-2 px-2 py-1 bg-gray-100 rounded-md'>
        <span
          className={`text-sm font-bold ${getVoteCount() > 0 ? 'text-green-600' : getVoteCount() < 0 ? 'text-red-600' : 'text-gray-600'}`}
        >
          {getVoteCount() > 0 ? '+' : ''}
          {getVoteCount()}
        </span>
      </div>
    </div>
  )
}

export default VoteButton
