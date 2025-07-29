// Lokasi: src/pages/CartPage.jsx

import React from 'react';
import { useCartStore } from '../store/cartStore';
import { createTransaction } from '../services/api'; // <-- 1. Import fungsi baru

const CartPage = () => {
  const { items, removeFromCart, clearCart } = useCartStore();
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // 2. Modifikasi fungsi handleCheckout
  const handleCheckout = async () => {
    const transactionDetails = {
      orderId: `ORDER-${Date.now()}`,
      totalAmount: totalPrice,
      items: items.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.title,
      })),
      customerDetails: {
        first_name: "Pelanggan", // Nanti ambil dari form
        email: "pelanggan@email.com",
        phone: "08123456789",
      },
    };

    try {
      // 3. Panggil backend untuk mendapatkan token transaksi
      const transaction = await createTransaction(transactionDetails);
      const { token } = transaction;

      // 4. Buka popup pembayaran Midtrans menggunakan token
      window.snap.pay(token, {
        onSuccess: function(result){
          /* Anda bisa menangani pembayaran sukses di sini */
          alert("Pembayaran sukses!");
          console.log(result);
          clearCart(); // Kosongkan keranjang setelah sukses
        },
        onPending: function(result){
          /* Pelanggan belum menyelesaikan pembayaran */
          alert("Menunggu pembayaran Anda!");
          console.log(result);
        },
        onError: function(result){
          /* Terjadi error saat pembayaran */
          alert("Pembayaran gagal!");
          console.log(result);
        },
        onClose: function(){
          /* Pelanggan menutup popup tanpa menyelesaikan pembayaran */
          alert('Anda menutup popup pembayaran.');
        }
      });
    } catch (error) {
      alert("Gagal memproses checkout. Silakan coba lagi.");
    }
  };

  // ... (sisa kode JSX tidak berubah) ...
  if (items.length === 0) {
    return <div className="cart-empty">Keranjang Anda kosong.</div>;
  }

  return (
    <div className="cart-page">
      <h2>Keranjang Belanja</h2>
      {/* ... sisa kode JSX ... */}
      <div className="cart-summary">
        <h3>Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrice)}</h3>
        <button onClick={handleCheckout} className="checkout-button">
          Lanjut ke Pembayaran
        </button>
        {/* ... sisa tombol ... */}
      </div>
    </div>
  );
};

export default CartPage;