// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);

  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Fetch some products for featured section
    dispatch(fetchProducts({ limit: 6 }));
  }, [dispatch]);

  useEffect(() => {
    // Set featured products (first 3 products)
    if (products.length > 0) {
      setFeaturedProducts(products.slice(0, 3));
    }
  }, [products]);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navigationCards = [
    {
      title: 'Browse Products',
      description: 'Explore our wide range of products',
      icon: '🛍️',
      path: '/products',
      color: 'blue'
    },
    {
      title: 'Electronics',
      description: 'Latest gadgets and technology',
      icon: '📱',
      path: '/products?category=Electronics',
      color: 'purple'
    },
    {
      title: 'Clothing',
      description: 'Fashion and apparel for everyone',
      icon: '👕',
      path: '/products?category=Clothing',
      color: 'pink'
    },
    {
      title: 'Books',
      description: 'Knowledge and entertainment',
      icon: '📚',
      path: '/products?category=Books',
      color: 'green'
    },
    {
      title: 'Home & Garden',
      description: 'Everything for your home',
      icon: '🏠',
      path: '/products?category=Home',
      color: 'orange'
    },
    {
      title: 'My Cart',
      description: `${cartItemCount} items in your cart`,
      icon: '🛒',
      path: '/cart',
      color: 'red',
      badge: cartItemCount > 0 ? cartItemCount : null
    }
  ];

  const accountCards = user ? [
    {
      title: 'My Profile',
      description: 'Manage your account settings',
      icon: '👤',
      path: '/profile',
      color: 'indigo'
    },
    {
      title: 'My Orders',
      description: 'Track your order history',
      icon: '📦',
      path: '/orders',
      color: 'teal'
    }
  ] : [
    {
      title: 'Sign In',
      description: 'Access your account',
      icon: '🔑',
      path: '/login',
      color: 'blue'
    },
    {
      title: 'Create Account',
      description: 'Join our community today',
      icon: '✨',
      path: '/register',
      color: 'green'
    }
  ];

  const adminCards = user?.role === 'admin' ? [
    {
      title: 'Admin Dashboard',
      description: 'Manage your store',
      icon: '⚙️',
      path: '/admin/dashboard',
      color: 'dark'
    },
    {
      title: 'Manage Products',
      description: 'Add and edit products',
      icon: '📋',
      path: '/admin/products',
      color: 'yellow'
    }
  ] : [];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to E-Shop</h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">🛒</div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="nav-section">
        <div className="section-header">
          <h2>Quick Navigation</h2>
          <p>Find what you're looking for quickly</p>
        </div>
        
        <div className="cards-grid">
          {navigationCards.map((card, index) => (
            <div
              key={index}
              className={`nav-card ${card.color}`}
              onClick={() => navigate(card.path)}
            >
              <div className="card-icon">
                {card.icon}
                {card.badge && (
                  <span className="card-badge">{card.badge}</span>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* Account Section */}
      <section className="account-section">
        <div className="section-header">
          <h2>{user ? 'My Account' : 'Get Started'}</h2>
          <p>{user ? `Welcome back, ${user.name}!` : 'Join our community today'}</p>
        </div>
        
        <div className="cards-grid account-grid">
          {accountCards.map((card, index) => (
            <div
              key={index}
              className={`nav-card ${card.color}`}
              onClick={() => navigate(card.path)}
            >
              <div className="card-icon">{card.icon}</div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
          
          {adminCards.map((card, index) => (
            <div
              key={`admin-${index}`}
              className={`nav-card ${card.color}`}
              onClick={() => navigate(card.path)}
            >
              <div className="card-icon">{card.icon}</div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Check out our latest and most popular items</p>
          </div>
          
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="featured-card"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <div className="featured-image">
                  <img
                    src={`http://localhost:5000/uploads/${product.images[0]}`}
                    alt={product.name}
                  />
                </div>
                <div className="featured-content">
                  <h4>{product.name}</h4>
                  <p className="featured-price">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="featured-action">
            <button
              className="view-all-btn"
              onClick={() => navigate('/products')}
            >
              View All Products →
            </button>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose E-Shop?</h2>
          <p>We provide the best shopping experience</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Free delivery on orders over $50</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payment</h3>
            <p>Your payment information is safe</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">↩️</div>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📞</div>
            <h3>24/7 Support</h3>
            <p>We're here to help anytime</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Shopping?</h2>
          <p>Discover thousands of products waiting for you</p>
          <div className="cta-buttons">
            <button
              className="cta-primary"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </button>
            {!user && (
              <button
                className="cta-secondary"
                onClick={() => navigate('/register')}
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
