// Lokasi: src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard'; // Komponen ini akan kita buat selanjutnya
import SkeletonLoading from '../components/SkeletonLoading'; // Komponen untuk loading

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fungsi untuk memuat data saat komponen pertama kali dirender
    const loadProducts = async () => {
      try {
        setIsLoading(true); // Mulai loading
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message); // Tangkap error jika gagal
      } finally {
        setIsLoading(false); // Selesai loading (baik berhasil maupun gagal)
      }
    };

    loadProducts();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  // Tampilan kondisional berdasarkan state
  if (isLoading) {
    // Tampilkan beberapa skeleton card selama loading
    return (
      <div className="product-gallery">
        {[...Array(6)].map((_, i) => <SkeletonLoading key={i} />)}
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Oops, terjadi kesalahan: {error}</div>;
  }

  return (
    <main>
      {/* Di sini nanti bisa ditambahkan Image Slider & Gallery Kategori */}
      
      <h2 className="section-title">Produk Kami</h2>
      <div className="product-gallery">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default HomePage;