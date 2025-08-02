// src/pages/Products.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/productsSlice';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const { products, isLoading, totalPages, currentPage } = useSelector((state) => state.products);
  
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page }));
  }, [dispatch, filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-page">
      <div className="filters-section">
        <div className="filters">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleFilterChange}
            className="filter-input"
          />
          
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home">Home & Garden</option>
          </select>
          
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="filter-input"
          />
          
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
