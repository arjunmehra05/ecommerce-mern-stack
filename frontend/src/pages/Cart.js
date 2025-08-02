// src/pages/Cart.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart } from '../store/cartSlice';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, totalAmount, isLoading } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="cart-page">
        <div className="cart-message">
          <h2>Please log in to view your cart</h2>
          <Link to="/login" className="login-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <Link to="/products" className="continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {items.map(item => (
            <div key={item._id} className="cart-item">
              <img 
                src={`http://localhost:5000/uploads/${item.product.images[0]}`} 
                alt={item.product.name}
                className="item-image"
              />
              
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-price">${item.price}</p>
              </div>
              
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
              
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              
              <button 
                onClick={() => handleRemoveItem(item._id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-line">
            <span>Subtotal:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Shipping:</span>
            <span>$10.00</span>
          </div>
          <div className="summary-line total">
            <span>Total:</span>
            <span>${(totalAmount + 10).toFixed(2)}</span>
          </div>
          
          <button onClick={handleCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
