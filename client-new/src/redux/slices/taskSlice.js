// src/redux/slices/taskSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper to get token from thunkAPI state and build config with Authorization header
const getAuthConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || '/';

// Fetch tasks thunk
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI);
    const response = await axios.get(`${API_URL}/api/tasks`, config);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to fetch tasks';
    return thunkAPI.rejectWithValue(message);
  }
});

// Add task thunk - handles full taskData
export const addTaskAsync = createAsyncThunk('tasks/addTaskAsync', async (taskData, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI);
    const payload = {
      title: taskData.title,
      description: taskData.description || '',
      category_id: taskData.category_id ? parseInt(taskData.category_id) : null,
      priority: taskData.priority || '',
      estimate: taskData.estimate || '',
      due_date: taskData.due_date || null,
      completed: false,
    };
    const response = await axios.post(`${API_URL}/api/tasks`, payload, config);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to add task';
    return thunkAPI.rejectWithValue(message);
  }
});

// Update task thunk - handles full taskData
export const updateTaskAsync = createAsyncThunk('tasks/updateTaskAsync', async (taskData, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI);
    const payload = {
      title: taskData.title,
      description: taskData.description || '',
      category_id: taskData.category_id ? parseInt(taskData.category_id) : null,
      priority: taskData.priority || '',
      estimate: taskData.estimate || '',
      due_date: taskData.due_date || null,
      completed: taskData.completed || false,
    };
    const response = await axios.put(`${API_URL}/api/tasks/${taskData.id}`, payload, config);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to update task';
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete task thunk
export const deleteTaskAsync = createAsyncThunk('tasks/deleteTaskAsync', async (taskId, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI);
    await axios.delete(`${API_URL}/api/tasks/${taskId}`, config);
    return taskId;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || 'Failed to delete task';
    return thunkAPI.rejectWithValue(message);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTasks(state) {
      state.tasks = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // add task
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // update task
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // delete task
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
