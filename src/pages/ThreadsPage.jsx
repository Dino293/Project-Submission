// File: src/pages/ThreadsPage.js
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchThreads, setSelectedCategory } from '../store/slices/threadsSlice'
import { toggleThreadForm } from '../store/slices/uiSlice'
import ThreadList from '../components/thread/ThreadList'
import ThreadForm from '../components/thread/ThreadForm'
import Loading from '../components/common/Loading'
import Button from '../components/common/Button'
import Navbar from '../components/common/Navbar'

const ThreadsPage = () => {
  const dispatch = useDispatch()
  const { threads, loading, selectedCategory } = useSelector((state) => state.threads)
  const { showThreadForm } = useSelector((state) => state.ui)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchThreads())
  }, [dispatch])

  // Extract unique categories from threads
  const categories = ['all', ...new Set(threads.map((thread) => thread.category).filter(Boolean))]

  const filteredThreads =
    selectedCategory === 'all'
      ? threads
      : threads.filter((thread) => thread.category === selectedCategory)

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='container px-4 py-8 mx-auto'>
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <h1 className='text-3xl font-bold text-gray-900'>Forum Diskusi</h1>
            {token && !showThreadForm && (
              <Button variant='primary' onClick={() => dispatch(toggleThreadForm())}>
                + Buat Thread Baru
              </Button>
            )}
          </div>

          {showThreadForm && <ThreadForm />}

          {/* Category Filter */}
          <div className='mb-6'>
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => dispatch(setSelectedCategory(category))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category === 'all' ? 'Semua' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : filteredThreads.length > 0 ? (
          <ThreadList threads={filteredThreads} />
        ) : (
          <div className='py-12 text-center'>
            <svg
              className='w-12 h-12 mx-auto text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
            <h3 className='mt-2 text-sm font-medium text-gray-900'>Tidak ada thread</h3>
            <p className='mt-1 text-sm text-gray-500'>
              {selectedCategory === 'all'
                ? 'Belum ada thread yang dibuat.'
                : `Tidak ada thread dengan kategori "${selectedCategory}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ThreadsPage
