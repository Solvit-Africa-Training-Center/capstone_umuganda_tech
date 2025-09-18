import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import projectSlice from './slices/projectSlice';
import volunteerDashboardSlice from './slices/volunteerDashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectSlice,
    volunteerDashboard: volunteerDashboardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;