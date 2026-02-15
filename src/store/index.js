import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import threadsReducer from './slices/threadsSlice';
import commentsReducer from './slices/commentsSlice';
import leaderboardsReducer from './slices/leaderboardsSlice';
import uiReducer from './slices/uiSlice';
import { loadingBarReducer } from '@dimasmds/react-redux-loading-bar';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    comments: commentsReducer,
    leaderboards: leaderboardsReducer,
    ui: uiReducer,
    loadingBar: loadingBarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
