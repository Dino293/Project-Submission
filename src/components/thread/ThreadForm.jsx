import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { createThread } from '../../store/slices/threadsSlice'
import { toggleThreadForm } from '../../store/slices/uiSlice'
import Input from '../common/Input'
import Button from '../common/Button'

const ThreadForm = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.threads)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: { title: '', body: '', category: '' },
  })

  const onSubmit = async (data) => {
    try {
      await dispatch(createThread(data)).unwrap()
      dispatch(toggleThreadForm())
    } catch (error) {
      setError('root', { type: 'manual', message: 'Gagal membuat thread' })
      console.error('Failed to create thread:', error)
    }
  }

  return (
    <div className='p-6 mb-6 bg-white rounded-lg shadow'>
      <h2 className='mb-4 text-xl font-bold text-gray-900'>Buat Thread Baru</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label='Judul'
          name='title'
          placeholder='Masukkan judul thread'
          error={errors.title?.message}
          required
          {...register('title', { required: 'Judul wajib diisi' })}
        />

        <div className='mb-4'>
          <label className='block mb-1 text-sm font-medium text-gray-700'>Konten</label>
          <textarea
            name='body'
            placeholder='Tulis konten thread di sini...'
            rows='5'
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.body ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('body', { required: 'Konten wajib diisi' })}
          />
          {errors.body && <p className='mt-1 text-sm text-red-600'>{errors.body.message}</p>}
        </div>

        <Input
          label='Kategori (opsional)'
          name='category'
          placeholder='Contoh: Programming, Technology'
          {...register('category')}
        />

        {errors.root && <div className='mb-4 text-sm text-red-600'>{errors.root.message}</div>}

        <div className='flex justify-end space-x-3'>
          <Button
            type='button'
            variant='outline'
            onClick={() => dispatch(toggleThreadForm())}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type='submit' variant='primary' isLoading={loading}>
            Buat Thread
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ThreadForm
