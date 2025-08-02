// src/components/ImageUpload.js
import React, { useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ images, setImages, maxImages = 5 }) => {
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image format`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setImages([...images, ...validFiles]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleImageSelect({ target: { files } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="image-upload">
      <div
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-content">
          <div className="upload-icon">📷</div>
          <p>Click to upload or drag and drop</p>
          <p className="upload-info">PNG, JPG, GIF up to 5MB each (max {maxImages} images)</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
      </div>

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="remove-image-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
