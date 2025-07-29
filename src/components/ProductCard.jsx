// Lokasi: src/components/ProductCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaPlus } from 'react-icons/fa';
import { useCartStore } from '../store/cartStore'; // <-- 1. Import store

const ProductCard = ({ product }) => {
  // 2. Ambil fungsi `addToCart` dari store
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    // 3. Panggil fungsi `addToCart` saat tombol diklik
    addToCart(product);
    console.log(`${product.title} ditambahkan ke keranjang!`); // Notif sederhana
  };

  if (!product) return null;
  
  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -5 }}
    >
      <div className="card-image-container">
        <img src={product.imageUrl} alt={product.title} />
        <button className="favorite-btn" title="Jadikan Favorit"><FaHeart /></button>
      </div>
      <div className="card-body">
        <h4 className="product-title">{product.title}</h4>
        <p className="product-price">
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
        </p>
      </div>
      {/* 4. Hubungkan tombol dengan fungsi handleAddToCart */}
      <button onClick={handleAddToCart} className="add-to-cart-btn" title="Tambah ke Keranjang">
        <FaPlus />
      </button>
    </motion.div>
  );
};

export default ProductCard;