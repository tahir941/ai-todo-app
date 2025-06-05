// src/redux/slices/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.get('https://ai-todo-app-ir47.onrender.com/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      // Return a more informative error message if available
      const message =
        err.response?.data?.message ||
        err.message ||
        'An error occurred while fetching categories.';
      return rejectWithValue(message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default categorySlice.reducer;
