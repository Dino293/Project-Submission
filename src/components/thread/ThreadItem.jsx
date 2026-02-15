import { Link } from 'react-router-dom';
import { truncateText } from '../../utils/formatters';
import { formatDate } from '../../utils/formatters';
import VoteButton from '../vote/VoteButton';
import { useSelector } from 'react-redux';

const ThreadItem = ({ thread }) => {
  const { user } = useSelector((state) => state.auth);

  const getUserVote = () => {
    if (!user) return 0;
    if (thread.upVotesBy?.includes(user.id)) return 1;
    if (thread.downVotesBy?.includes(user.id)) return -1;
    return 0;
  };

  return (
    <div className='p-6 mb-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md'>
      <div className='flex flex-col'>
        {/* Header thread */}
        <div className='flex items-start justify-between mb-3'>
          <div className='flex-1'>
            <Link to={`/threads/${thread.id}`}>
              <h3 className='text-lg font-semibold text-gray-900 hover:text-blue-600 mb-1'>
                {thread.title}
              </h3>
            </Link>
            <span className='px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full'>
              {thread.category || 'General'}
            </span>
          </div>
        </div>

        {/* Konten thread */}
        <p className='mb-4 text-gray-600'>{truncateText(thread.body, 200)}</p>

        {/* Info pengguna dan metadata */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-3'>
            <div className='flex items-center'>
              <img
                src={
                  thread.owner?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    thread.owner?.name || 'User'
                  )}&background=3b82f6&color=fff`
                }
                alt={thread.owner?.name}
                className='w-6 h-6 mr-2 rounded-full'
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    thread.owner?.name || 'User'
                  )}&background=3b82f6&color=fff`;
                }}
              />
              <span className='font-medium text-sm'>{thread.owner?.name || 'Unknown User'}</span>
            </div>
            <span className='text-gray-400'>•</span>
            <span className='text-sm text-gray-500'>{formatDate(thread.createdAt)}</span>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='flex items-center text-sm text-gray-500'>
              <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                />
              </svg>
              <span>{thread.totalComments || 0} komentar</span>
            </div>
          </div>
        </div>

        {/* Voting Section - Horizontal seperti sosial media */}
        <div className='pt-3 border-t border-gray-100'>
          <VoteButton
            type='thread'
            id={thread.id}
            currentVote={getUserVote()}
            upVotes={thread.upVotesBy?.length || 0}
            downVotes={thread.downVotesBy?.length || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ThreadItem;
