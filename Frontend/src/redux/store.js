import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import goalReducer from './slices/goalSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalReducer,
    users: userReducer,
  },
  // Middleware for serializable checks (optional but recommended)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;