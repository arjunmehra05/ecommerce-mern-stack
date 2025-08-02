// src/store/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/products';

/* ---------- Thunks ---------- */
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, category, minPrice, maxPrice, search } =
        filters;
      let url = `${API}?page=${page}&limit=${limit}`;
      if (category) url += `&category=${category}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (search)   url += `&search=${search}`;
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Fetch failed');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/${id}`);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Fetch failed');
    }
  }
);

/* ---------- Slice ---------- */
const slice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    totalPages: 0,
    currentPage: 1,
    total: 0,
    isLoading: false,
    isLoadingProduct: false,
    error: null,
    filters: { category: '', minPrice: '', maxPrice: '', search: '' }
  },
  reducers: {
    clearSelectedProduct: state => {
      state.selectedProduct = null;
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload };
    }
  },
  extraReducers: builder => {
    builder
      /* list */
      .addCase(fetchProducts.pending, s => { s.isLoading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, { payload }) => {
        s.isLoading = false;
        Object.assign(s, payload);
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.isLoading = false; s.error = a.payload;
      })
      /* detail */
      .addCase(fetchProductById.pending, s => { s.isLoadingProduct = true; s.error = null; })
      .addCase(fetchProductById.fulfilled, (s, { payload }) => {
        s.isLoadingProduct = false; s.selectedProduct = payload;
      })
      .addCase(fetchProductById.rejected, (s, a) => {
        s.isLoadingProduct = false; s.error = a.payload;
      });
  }
});

export const { clearSelectedProduct, setFilters } = slice.actions;
export default slice.reducer;
