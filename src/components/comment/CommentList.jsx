import PropTypes from 'prop-types';
import CommentItem from './CommentItem';
import { useSelector } from 'react-redux';

const CommentList = ({ comments, threadId }) => {
  const { loading } = useSelector((state) => state.comments);

  if (loading) {
    return (
      <div className='flex justify-center py-8'>
        <div className='w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className='text-center py-8'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
          />
        </svg>
        <h3 className='mt-2 text-sm font-medium text-gray-900'>Belum ada komentar</h3>
        <p className='mt-1 text-sm text-gray-500'>Jadilah yang pertama berkomentar!</p>
      </div>
    );
  }

  // Sort comments by newest first
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className='space-y-4'>
      {sortedComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} threadId={threadId} />
      ))}
    </div>
  );
};

CommentList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      owner: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        avatar: PropTypes.string,
      }),
      upVotesBy: PropTypes.arrayOf(PropTypes.string),
      downVotesBy: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  threadId: PropTypes.string.isRequired,
};

CommentList.defaultProps = {
  comments: [],
};

export default CommentList;
