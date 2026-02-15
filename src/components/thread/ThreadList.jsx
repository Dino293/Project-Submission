import PropTypes from 'prop-types'
import ThreadItem from './ThreadItem'
import { useSelector } from 'react-redux'
import Button from '../common/Button'
import { toggleThreadForm } from '../../store/slices/uiSlice'
import { useDispatch } from 'react-redux'

const ThreadList = ({ threads }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.threads)
  const { token } = useSelector((state) => state.auth)
  const { showThreadForm } = useSelector((state) => state.ui)

  const handleCreateThread = () => {
    dispatch(toggleThreadForm())
  }

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
      </div>
    )
  }

  if (!threads || threads.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='mx-auto max-w-md'>
          <svg
            className='mx-auto h-16 w-16 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          <h3 className='mt-4 text-lg font-medium text-gray-900'>Belum ada thread</h3>
          <p className='mt-2 text-gray-500'>Jadilah yang pertama memulai diskusi!</p>
          {token && !showThreadForm && (
            <div className='mt-6'>
              <Button
                variant='primary'
                onClick={handleCreateThread}
                className='inline-flex items-center'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4v16m8-8H4'
                  />
                </svg>
                Buat Thread Pertama
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Sort threads by newest first
  const sortedThreads = [...threads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className='space-y-6'>
      {/* Thread Stats */}
      <div className='bg-white rounded-lg shadow p-4 mb-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>{threads.length} Thread</h3>
            <p className='text-sm text-gray-500'>Diskusi aktif dalam komunitas</p>
          </div>
          {token && !showThreadForm && (
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
          )}
        </div>
      </div>

      {/* Threads List */}
      <div className='space-y-4'>
        {sortedThreads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </div>

      {/* Pagination Info */}
      <div className='bg-white rounded-lg shadow p-4 mt-6'>
        <div className='flex items-center justify-between'>
          <p className='text-sm text-gray-600'>
            Menampilkan {sortedThreads.length} dari {threads.length} thread
          </p>
          <p className='text-sm text-gray-600'>
            Urutkan berdasarkan: <span className='font-medium'>Terbaru</span>
          </p>
        </div>
      </div>
    </div>
  )
}

ThreadList.propTypes = {
  threads: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ),
}

ThreadList.defaultProps = {
  threads: [],
}

export default ThreadList
