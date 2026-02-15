import PropTypes from 'prop-types';
import { formatDate } from '../../utils/formatters';
import VoteButton from '../vote/VoteButton';
import { useSelector } from 'react-redux';

const CommentItem = ({ comment, threadId }) => {
  const { user } = useSelector((state) => state.auth);

  const getUserVote = () => {
    if (!user) return 0;
    if (comment.upVotesBy?.includes(user.id)) return 1;
    if (comment.downVotesBy?.includes(user.id)) return -1;
    return 0;
  };

  return (
    <div className='py-4 border-b border-gray-200'>
      {/* Header dengan info pengguna */}
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          <img
            src={
              comment.owner?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                comment.owner?.name || 'User'
              )}&background=3b82f6&color=fff`
            }
            alt={comment.owner?.name}
            className='w-8 h-8 mr-2 rounded-full'
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                comment.owner?.name || 'User'
              )}&background=3b82f6&color=fff`;
            }}
          />
          <div>
            <span className='font-medium text-gray-900'>{comment.owner?.name}</span>
            <span className='block text-sm text-gray-500'>{formatDate(comment.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Konten komentar */}
      <p className='mb-3 text-gray-700 whitespace-pre-line'>{comment.content}</p>

      {/* Voting Section - Horizontal seperti sosial media */}
      <div className='flex items-center justify-between'>
        <VoteButton
          type='comment'
          id={comment.id}
          threadId={threadId}
          currentVote={getUserVote()}
          upVotes={comment.upVotesBy?.length || 0}
          downVotes={comment.downVotesBy?.length || 0}
        />

        {/* Optional: Tombol balas atau aksi lain */}
        <div className='text-sm text-gray-500'>{/* Tambahkan tombol balas jika diperlukan */}</div>
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
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
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentItem;
