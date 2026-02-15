import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

const NotFoundPage = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='container px-4 py-16 mx-auto text-center'>
        <h1 className='font-bold text-gray-200 text-9xl'>404</h1>
        <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Halaman tidak ditemukan</h2>
        <p className='mb-8 text-gray-600'>Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
        <Link
          to='/'
          className='inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
