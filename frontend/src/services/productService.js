// src/services/productService.js
import axios from 'axios';

const API = 'http://localhost:5000/api/products';

export const productService = {
  getProducts: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const { data } = await axios.get(`${API}?${qs}`);
    return data;
  },

  getProductById: async id => {
    const { data } = await axios.get(`${API}/${id}`);
    return data;
  }
};
