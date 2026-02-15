const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
          <p className='mt-4 text-gray-600'>Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex justify-center py-8'>
      <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
    </div>
  )
}

export default Loading
