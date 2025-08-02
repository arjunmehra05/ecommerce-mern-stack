// src/components/admin/AdminNavbar.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';

const AdminNavbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="navbar-right">
        <div className="admin-profile">
          <span>Welcome, {user?.name}</span>
          <div className="profile-dropdown">
            <button className="profile-btn">
              {user?.name?.charAt(0).toUpperCase()}
            </button>
            <div className="dropdown-content">
              <button onClick={() => navigate('/admin/profile')}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
