import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/AuthSlice';
import Button from './Button';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className='bg-white shadow-lg'>
      <div className='container px-4 mx-auto'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-8'>
            <Link to='/' className='text-xl font-bold text-blue-600'>
              Forum Diskusi
            </Link>
            <div className='hidden space-x-6 md:flex'>
              <Link to='/' className='text-gray-700 transition-colors hover:text-blue-600'>
                Threads
              </Link>
              <Link
                to='/leaderboard'
                className='text-gray-700 transition-colors hover:text-blue-600'
              >
                Leaderboard
              </Link>
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            {token ? (
              <>
                <div className='flex items-center space-x-3'>
                  <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt={user?.name}
                    className='w-8 h-8 rounded-full'
                  />
                  <span className='hidden text-sm text-gray-700 md:inline'>{user?.name}</span>
                </div>
                <Button variant='outline' size='sm' onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to='/login'>
                  <Button variant='outline' size='sm'>
                    Login
                  </Button>
                </Link>
                <Link to='/register'>
                  <Button variant='primary' size='sm'>
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
