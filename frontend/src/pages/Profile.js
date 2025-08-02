// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateProfile,
  changePassword,
  deleteAccount,
  clearError,
  clearMessage,
  logout
} from '../store/authSlice';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, message } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');

  // Form validation
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Show password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
  }, [user]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  // Profile form handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error for this field
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Password form handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};

    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    } else if (profileData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!profileData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email is invalid';
    }

    if (profileData.phone && !/^\+?[\d\s\-\(\)]+$/.test(profileData.phone)) {
      errors.phone = 'Phone number is invalid';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit profile form
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    try {
      await dispatch(updateProfile(profileData)).unwrap();
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  // Submit password form
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap();
      
      // Clear form on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      alert('Please enter your password to confirm account deletion');
      return;
    }

    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      try {
        await dispatch(deleteAccount({ password: deletePassword })).unwrap();
        setShowDeleteModal(false);
        navigate('/');
      } catch (error) {
        console.error('Account deletion failed:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="message success">
            <span>✅ {message}</span>
            <button onClick={() => dispatch(clearMessage())}>×</button>
          </div>
        )}

        {error && (
          <div className="message error">
            <span>❌ {error}</span>
            <button onClick={() => dispatch(clearError())}>×</button>
          </div>
        )}

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile Information
          </button>
          <button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 Change Password
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Account Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={profileErrors.name ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {profileErrors.name && (
                      <span className="error-text">{profileErrors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={profileErrors.email ? 'error' : ''}
                      placeholder="Enter your email"
                    />
                    {profileErrors.email && (
                      <span className="error-text">{profileErrors.email}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className={profileErrors.phone ? 'error' : ''}
                    placeholder="Enter your phone number"
                  />
                  {profileErrors.phone && (
                    <span className="error-text">{profileErrors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h3>Address Information</h3>
                
                <div className="form-group">
                  <label htmlFor="street">Street Address</label>
                  <input
                    type="text"
                    id="street"
                    name="address.street"
                    value={profileData.address.street}
                    onChange={handleProfileChange}
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="address.city"
                      value={profileData.address.city}
                      onChange={handleProfileChange}
                      placeholder="Enter your city"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State/Province</label>
                    <input
                      type="text"
                      id="state"
                      name="address.state"
                      value={profileData.address.state}
                      onChange={handleProfileChange}
                      placeholder="Enter your state"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP/Postal Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="address.zipCode"
                      value={profileData.address.zipCode}
                      onChange={handleProfileChange}
                      placeholder="Enter your ZIP code"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="address.country"
                      value={profileData.address.country}
                      onChange={handleProfileChange}
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-section">
                <h3>Change Password</h3>
                <p>Ensure your account is secure by using a strong password</p>

                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password *</label>
                  <div className="password-input">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={passwordErrors.currentPassword ? 'error' : ''}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <span className="error-text">{passwordErrors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password *</label>
                  <div className="password-input">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={passwordErrors.newPassword ? 'error' : ''}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <span className="error-text">{passwordErrors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password *</label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={passwordErrors.confirmPassword ? 'error' : ''}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <span className="error-text">{passwordErrors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-content">
              <div className="form-section">
                <h3>Account Information</h3>
                <div className="account-info">
                  <div className="info-item">
                    <span className="label">Member since:</span>
                    <span className="value">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Account type:</span>
                    <span className="value">{user.role === 'admin' ? 'Administrator' : 'Customer'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">User ID:</span>
                    <span className="value">{user._id}</span>
                  </div>
                </div>
              </div>

              <div className="form-section danger-zone">
                <h3>Danger Zone</h3>
                <p>These actions are irreversible. Please proceed with caution.</p>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-danger"
                >
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Delete Account</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="warning">
                  <p>⚠️ <strong>Warning:</strong> This action cannot be undone.</p>
                  <p>Deleting your account will permanently remove:</p>
                  <ul>
                    <li>Your profile information</li>
                    <li>Your order history</li>
                    <li>Your saved items</li>
                    <li>All associated data</li>
                  </ul>
                </div>
                
                <form onSubmit={handleDeleteAccount}>
                  <div className="form-group">
                    <label htmlFor="deletePassword">
                      Enter your password to confirm deletion:
                    </label>
                    <div className="password-input">
                      <input
                        type={showDeletePassword ? 'text' : 'password'}
                        id="deletePassword"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                      >
                        {showDeletePassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-danger"
                    >
                      {isLoading ? 'Deleting...' : 'Delete Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
