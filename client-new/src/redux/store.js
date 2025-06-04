// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './slices/categorySlice';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice'; // Import taskSlice

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    auth: authReducer,
    tasks: taskReducer,  // Add this line
  },
  // Optional: Enable Redux devtools and middleware
  devTools: process.env.NODE_ENV !== 'production',
});
