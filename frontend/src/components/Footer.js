// src/components/Footer.js
import React from 'react';
import './Footer.css'; // You can create this file as needed, or remove this line

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#2c3e50', color: 'white' }}>
      &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
    </footer>
  );
};

export default Footer;
