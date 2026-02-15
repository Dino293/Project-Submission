import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBar from '@dimasmds/react-redux-loading-bar';
import { getOwnProfile } from './store/slices/AuthSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ThreadsPage from './pages/ThreadsPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getOwnProfile());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <LoadingBar style={{ backgroundColor: '#3b82f6', height: '3px' }} />
      <Routes>
        <Route path='/' element={<ThreadsPage />} />
        <Route path='/threads/:id' element={<ThreadDetailPage />} />
        <Route path='/leaderboard' element={<LeaderboardPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
