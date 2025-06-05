// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

function safeParseJSON(item) {
  try {
    return JSON.parse(item);
  } catch {
    // If parsing fails, remove the corrupted item and return null
    localStorage.removeItem('user');
    return null;
  }
}

// Load token and user from localStorage safely
const token = localStorage.getItem('token') || null;
const user = safeParseJSON(localStorage.getItem('user'));

const initialState = {
  user,
  token,
  status: 'idle',
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post('https://ai-todo-app-ir47.onrender.com/api/auth/login', { email, password });
      console.log('Login response.data:', response.data);

      const { token, user, error } = response.data;

      if (error) {
        return thunkAPI.rejectWithValue(error);
      }
      if (!token) {
        return thunkAPI.rejectWithValue('Invalid login response: Missing token');
      }
      if (!user) {
        return thunkAPI.rejectWithValue('Invalid login response: Missing user details');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      console.error('Login request failed:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await axios.post('https://ai-todo-app-ir47.onrender.com/api/auth/register', {
        username,
        email,
        password,
      });
      const { token, user, error } = response.data;

      if (error) {
        return thunkAPI.rejectWithValue(error);
      }
      if (!token) {
        return thunkAPI.rejectWithValue('Invalid registration response: Missing token');
      }
      if (!user) {
        return thunkAPI.rejectWithValue('Invalid registration response: Missing user details');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      console.error('Registration request failed:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
