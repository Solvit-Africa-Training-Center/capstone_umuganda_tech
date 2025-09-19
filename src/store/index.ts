// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import projectsReducer from '../features/projects/projectSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,   // make sure this key matches state.projects
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
