// src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => (
  <div className="pcard">
    <Link to={`/products/${product._id}`} className="pcard-link">
      <div className="pcard-imgwrap">
        <img
          src={`http://localhost:5000/uploads/${product.images[0]}`}
          alt={product.name}
        />
      </div>

      <div className="pcard-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
        <div className="rating">
          {[1,2,3,4,5].map(i=>(
            <span key={i}
              className={i<=Math.floor(product.ratings?.average||0)?"star filled":"star"}>
              ★
            </span>
          ))}
          <span className="count">({product.ratings?.count||0})</span>
        </div>
      </div>
    </Link>
  </div>
);

export default ProductCard;
