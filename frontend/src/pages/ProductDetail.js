// src/pages/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductById,
  clearSelectedProduct
} from '../store/productsSlice';
import { addToCart } from '../store/cartSlice';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const dispatch      = useDispatch();
  const { user }      = useSelector(s => s.auth);
  const { isLoadingProduct, selectedProduct, error } = useSelector(
    s => s.products
  );
  const { isLoading: cartLoading } = useSelector(s => s.cart);

  const [quantity, setQuantity]         = useState(1);
  const [thumbIndex, setThumbIndex]     = useState(0);
  const [showMore, setShowMore]         = useState(false);

  /* fetch on mount */
  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  useEffect(() => { setThumbIndex(0); }, [selectedProduct]);

  const handleAdd = async () => {
    if (!user) return navigate('/login');
    await dispatch(addToCart({ productId: id, quantity })).unwrap();
    alert('Added to cart');
  };

  /* ---- render ---- */
  if (isLoadingProduct) return <p className="pd-loading">Loading…</p>;
  if (error)           return <p className="pd-error">{error}</p>;
  if (!selectedProduct) return null;

  const p = selectedProduct;

  return (
    <div className="pd-wrapper">
      <div className="pd-grid">
        {/* images */}
        <div className="pd-images">
          <img
            className="pd-main"
            src={`http://localhost:5000/uploads/${p.images[thumbIndex]}`}
            alt={p.name}
          />
          {p.images.length > 1 && (
            <div className="pd-thumbs">
              {p.images.map((img, i) => (
                <img
                  key={i}
                  className={i === thumbIndex ? 'active' : ''}
                  src={`http://localhost:5000/uploads/${img}`}
                  alt={p.name + '_' + i}
                  onClick={() => setThumbIndex(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div className="pd-info">
          <h1>{p.name}</h1>
          <p className="pd-brand">{p.brand}</p>
          <p className="pd-price">${p.price.toFixed(2)}</p>

          {/* description */}
          <p className={`pd-desc ${showMore ? 'full' : 'short'}`}>
            {p.description}
          </p>
          {p.description.length > 200 && (
            <button
              className="pd-more"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? 'Show less' : 'Read more'}
            </button>
          )}

          {/* quantity */}
          {p.stock > 0 && (
            <div className="pd-qty">
              <button disabled={quantity === 1}
                onClick={() => setQuantity(q => q - 1)}>-</button>
              <input
                type="number"
                value={quantity}
                onChange={e =>
                  setQuantity(Math.min(Math.max(+e.target.value, 1), p.stock))
                }
              />
              <button disabled={quantity === p.stock}
                onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          )}

          {/* actions */}
          <div className="pd-actions">
            {p.stock > 0 ? (
              <>
                <button
                  className="add"
                  disabled={cartLoading}
                  onClick={handleAdd}
                >
                  {cartLoading ? 'Adding…' : '🛒 Add to cart'}
                </button>
                <button
                  className="buy"
                  onClick={() => {
                    handleAdd();
                    navigate('/checkout');
                  }}
                >
                  ⚡ Buy now
                </button>
              </>
            ) : (
              <button className="oos" disabled>Out of stock</button>
            )}
          </div>
        </div>
      </div>

      {/* specs */}
      {p.specifications.length > 0 && (
        <div className="pd-specs">
          <h3>Specifications</h3>
          {p.specifications.map((s, i) => (
            <div key={i}>
              <span>{s.name}</span>
              <span>{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
