import React from 'react';
import { useCartStore } from '../store/cartStore';
import { createTransaction } from '../services/api';

const CartPage = () => {
  const { items, removeFromCart, clearCart } = useCartStore();

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    // 1. Siapkan data untuk backend
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
        first_name: "Pelanggan",
        email: "pelanggan@email.com",
        phone: "08123456789",
      },
    };

    try {
      // 2. Panggil backend untuk mendapatkan token transaksi
      const transaction = await createTransaction(transactionDetails);
      const { token } = transaction;

      // 3. Buka popup pembayaran Midtrans
      window.snap.pay(token, {
        onSuccess: function(result){
          alert("Pembayaran sukses!");
          console.log(result);
          clearCart(); // Kosongkan keranjang
        },
        onPending: function(result){
          alert("Menunggu pembayaran Anda!");
          console.log(result);
        },
        onError: function(result){
          alert("Pembayaran gagal!");
          console.log(result);
        },
        onClose: function(){
          alert('Anda menutup popup pembayaran.');
        }
      });
    } catch (error) {
      alert("Gagal memproses checkout. Silakan coba lagi.");
      console.error(error);
    }
  };

  if (items.length === 0) {
    return <div className="cart-empty">Keranjang Anda kosong.</div>;
  }

  return (
    <div className="cart-page">
      <h2>Keranjang Belanja</h2>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.title} />
            <div className="item-details">
              <h4>{item.title}</h4>
              <p>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)} x {item.quantity}
              </p>
            </div>
            {/* Tombol ini sekarang memanggil removeFromCart */}
            <button onClick={() => removeFromCart(item.id)} className="remove-item-btn">Hapus</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrice)}</h3>
        {/* Tombol ini sekarang memanggil handleCheckout */}
        <button onClick={handleCheckout} className="checkout-button">
          Lanjut ke Pembayaran
        </button>
        <button onClick={clearCart} className="clear-cart-button">
          Kosongkan Keranjang
        </button>
      </div>
    </div>
  );
};

export default CartPage;