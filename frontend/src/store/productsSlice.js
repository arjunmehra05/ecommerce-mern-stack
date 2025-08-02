// src/store/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const API = `${API_BASE_URL}/api/products`;

// Async thunk: fetch all products (with optional filters)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Build query string from params
      const query = new URLSearchParams();

      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);

      const response = await axios.get(`${API}?${query.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk: fetch one product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    isLoading: false,
    isLoadingProduct: false,
    error: null,
    totalPages: 0,
    currentPage: 1
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.error = null;
      state.isLoadingProduct = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // List fetch
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || action.payload;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Single product fetch
      .addCase(fetchProductById.pending, (state) => {
        state.isLoadingProduct = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoadingProduct = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoadingProduct = false;
        state.error = action.payload;
      });
  }
});

// Export actions and reducer
export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
