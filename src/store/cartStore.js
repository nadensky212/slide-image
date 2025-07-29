// Lokasi: src/store/cartStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  // `persist` akan menyimpan data ke localStorage secara otomatis
  persist(
    (set, get) => ({
      items: [], // Array untuk menyimpan produk di keranjang

      // Aksi untuk menambah produk
      addToCart: (product) => {
        const cart = get().items;
        const productExists = cart.find(item => item.id === product.id);

        if (productExists) {
          // Jika produk sudah ada, tambah quantity-nya
          productExists.quantity += 1;
          set({ items: [...cart] });
        } else {
          // Jika produk baru, tambahkan ke keranjang dengan quantity 1
          set({ items: [...cart, { ...product, quantity: 1 }] });
        }
      },

      // Aksi untuk menghapus produk (contoh untuk nanti)
      removeFromCart: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },

      // Aksi untuk mengosongkan keranjang
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage', // Nama key di localStorage
    }
  )
);