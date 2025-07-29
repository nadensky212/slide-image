// Lokasi: src/components/SkeletonLoading.jsx
import React from 'react';

const SkeletonLoading = () => {
  return (
    <div className="product-card is-loading">
      <div className="skeleton skeleton-image"></div>
      <div className="card-body">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-price"></div>
      </div>
    </div>
  );
};

export default SkeletonLoading;