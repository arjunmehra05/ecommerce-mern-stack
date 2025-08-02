// src/pages/admin/AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from '../../components/ImageUpload';
import './ProductForm.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    brand: '',
    stock: '',
    specifications: []
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { name: '', value: '' }]
    });
  };

  const removeSpecification = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: newSpecs });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Append form fields
      Object.keys(formData).forEach(key => {
        if (key === 'specifications') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      await axios.post('/api/admin/products', formDataToSend, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <div className="form-header">
        <h1>Add New Product</h1>
        <button 
          type="button" 
          onClick={() => navigate('/admin/products')}
          className="back-btn"
        >
          ← Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={errors.stock ? 'error' : ''}
                />
                {errors.stock && <span className="error-text">{errors.stock}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Category & Brand</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home">Home & Garden</option>
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="subcategory">Subcategory</label>
                <input
                  type="text"
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Product Images *</h3>
          <ImageUpload
            images={images}
            setImages={setImages}
            maxImages={5}
          />
          {errors.images && <span className="error-text">{errors.images}</span>}
        </div>

        <div className="form-section">
          <h3>Specifications</h3>
          {formData.specifications.map((spec, index) => (
            <div key={index} className="specification-row">
              <input
                type="text"
                placeholder="Specification name"
                value={spec.name}
                onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Specification value"
                value={spec.value}
                onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="remove-spec-btn"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecification}
            className="add-spec-btn"
          >
            + Add Specification
          </button>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
