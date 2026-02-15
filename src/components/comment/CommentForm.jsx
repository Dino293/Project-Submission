import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { createComment } from '../../store/slices/commentsSlice'
import { fetchThreadDetail } from '../../store/slices/threadsSlice'
import Button from '../common/Button'

const CommentForm = ({ threadId }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.comments)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm({
    defaultValues: { content: '' },
  })

  const content = watch('content', '')

  const onSubmit = async (data) => {
    if (!user) {
      setError('content', { type: 'manual', message: 'Silakan login untuk berkomentar' })
      return
    }

    try {
      await dispatch(createComment({ threadId, content: data.content })).unwrap()
      dispatch(fetchThreadDetail(threadId))
      reset()
    } catch (err) {
      setError('content', {
        type: 'manual',
        message: 'Gagal mengirim komentar. Silakan coba lagi.',
      })
      console.error('Failed to create comment:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mb-6'>
      <div className='mb-4'>
        <label htmlFor='comment' className='block mb-2 text-sm font-medium text-gray-700'>
          Tambahkan Komentar
        </label>
        <textarea
          id='comment'
          rows='4'
          placeholder='Tulis komentar Anda di sini...'
          className={`w-full px-3 py-2 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={!user}
          {...register('content', {
            required: 'Komentar tidak boleh kosong',
            minLength: { value: 3, message: 'Komentar minimal 3 karakter' },
          })}
        />
        {!user && (
          <p className='mt-1 text-sm text-gray-500'>
            Silakan{' '}
            <a href='/login' className='text-blue-600 hover:text-blue-500'>
              login
            </a>{' '}
            untuk berkomentar
          </p>
        )}
        {errors.content && <p className='mt-1 text-sm text-red-600'>{errors.content.message}</p>}
        <div className='mt-1 text-sm text-gray-500'>
          {content.length > 0 ? `${content.length} karakter` : 'Minimal 3 karakter'}
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          type='submit'
          variant='primary'
          isLoading={loading}
          disabled={!content.trim() || content.trim().length < 3 || !user}
        >
          Kirim Komentar
        </Button>
      </div>
    </form>
  )
}

CommentForm.propTypes = {
  threadId: PropTypes.string.isRequired,
}

export default CommentForm
