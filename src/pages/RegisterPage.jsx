import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerUser, clearError } from '../store/slices/AuthSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: { name: '', email: '', password: '' },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
    } catch (err) {
      setError('root', { type: 'manual', message: err.message || 'Registrasi gagal' });
    }
  };

  return (
    <div className='flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-3xl font-extrabold text-center text-gray-900'>Buat akun baru</h2>
        <p className='mt-2 text-sm text-center text-gray-600'>
          Sudah punya akun?{' '}
          <Link to='/login' className='font-medium text-blue-600 hover:text-blue-500'>
            Masuk di sini
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <Input
              label='Nama'
              name='name'
              type='text'
              placeholder='Nama lengkap'
              error={errors.name?.message}
              required
              {...register('name', { required: 'Nama wajib diisi' })}
            />

            <Input
              label='Email'
              name='email'
              type='email'
              placeholder='email@example.com'
              error={errors.email?.message}
              required
              {...register('email', {
                required: 'Email wajib diisi',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email tidak valid',
                },
              })}
            />

            <Input
              label='Password'
              name='password'
              type='password'
              placeholder='Minimal 6 karakter'
              error={errors.password?.message}
              required
              {...register('password', {
                required: 'Password wajib diisi',
                minLength: { value: 6, message: 'Password minimal 6 karakter' },
              })}
            />

            {(error || errors.root) && (
              <div className='p-4 rounded-md bg-red-50'>
                <div className='flex'>
                  <div className='ml-3'>
                    <h3 className='text-sm font-medium text-red-800'>
                      {error || errors.root?.message}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type='submit'
                variant='primary'
                size='lg'
                className='w-full'
                isLoading={loading}
              >
                Daftar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
