import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import goalReducer from './slices/goalSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
