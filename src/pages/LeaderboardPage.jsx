import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLeaderboards } from '../store/slices/leaderboardsSlice'
import Loading from '../components/common/Loading'
import Navbar from '../components/common/Navbar'

const LeaderboardPage = () => {
  const dispatch = useDispatch()
  const { leaderboards, loading } = useSelector((state) => state.leaderboards)

  useEffect(() => {
    dispatch(fetchLeaderboards())
  }, [dispatch])

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-10'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Leaderboard</h1>
            <p className='text-gray-600'>Pengguna dengan kontribusi terbaik di forum diskusi</p>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className='bg-white rounded-lg shadow overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Peringkat
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Pengguna
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Skor
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {leaderboards.map((item, index) => (
                      <tr key={item.user.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                index === 0
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : index === 1
                                    ? 'bg-gray-100 text-gray-800'
                                    : index === 2
                                      ? 'bg-orange-100 text-orange-800'
                                      : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              <span className='font-bold'>{index + 1}</span>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-10 w-10'>
                              <img
                                className='h-10 w-10 rounded-full'
                                src={
                                  item.user.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    item.user.name
                                  )}&background=3b82f6&color=fff`
                                }
                                alt={item.user.name}
                              />
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900'>
                                {item.user.name}
                              </div>
                              <div className='text-sm text-gray-500'>{item.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-lg font-bold text-gray-900'>{item.score}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className='mt-8 text-center text-gray-500 text-sm'>
            <p>Skor dihitung berdasarkan kontribusi seperti membuat thread, komentar, dan vote.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage
