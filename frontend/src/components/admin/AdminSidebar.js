// src/components/admin/AdminSidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/products', icon: '📦', label: 'Products' },
    { path: '/admin/orders', icon: '📋', label: 'Orders' },
    { path: '/admin/users', icon: '👥', label: 'Users' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>E-Shop Admin</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
