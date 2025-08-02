// frontend/src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_URL from '../config/api';

const AUTH_API = `${API_URL}/api/auth`;

const api = axios.create({
  baseURL: AUTH_API,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, { rejectWithValue }) => {
  try {
    const response = await api.put('/change-password', passwordData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async (passwordData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${AUTH_API}/profile`, {
      headers: { 'x-auth-token': token },
      data: passwordData
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
    },
    clearError: state => { state.error = null; },
    clearMessage: state => { state.message = null; },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, state => {
        state.isLoading = true; state.error = null; state.message = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false; state.token = action.payload.token; state.user = action.payload.user; state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })
      .addCase(login.pending, state => {
        state.isLoading = true; state.error = null; state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false; state.token = action.payload.token; state.user = action.payload.user; state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })
      .addCase(getProfile.pending, state => {
        state.isLoading = true; state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false; state.user = action.payload; state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
        state.token = null; state.isAuthenticated = false; localStorage.removeItem('token');
      })
      .addCase(updateProfile.pending, state => {
        state.isLoading = true; state.error = null; state.message = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false; state.user = action.payload; state.message = 'Profile updated successfully!';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })
      .addCase(changePassword.pending, state => {
        state.isLoading = true; state.error = null; state.message = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false; state.message = action.payload.message || 'Password changed successfully!';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })
      .addCase(deleteAccount.pending, state => {
        state.isLoading = true; state.error = null; state.message = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false; state.user = null; state.token = null; state.isAuthenticated = false; localStorage.removeItem('token');
        state.message = action.payload.message || 'Account deleted successfully!';
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      });
  }
});

export const { logout, clearError, clearMessage, setCredentials } = authSlice.actions;
export default authSlice.reducer;
