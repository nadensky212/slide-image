// Lokasi: src/services/api.js

// URL ini akan otomatis diarahkan ke backend serverless oleh Netlify
const API_BASE_URL = '/api';

/**
 * Mengambil semua produk dari backend.
 */
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      // Jika respons dari server tidak "OK" (misal: error 500)
      throw new Error('Gagal mengambil data dari server.');
    }
    return await response.json();
  } catch (error)  {
    // Jika ada masalah jaringan atau error lainnya
    console.error("Error fetching products:", error);
    throw error; // Lemparkan error agar bisa ditangani oleh komponen
  }
};

export const createTransaction = async (transactionDetails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionDetails),
    });

    if (!response.ok) {
      throw new Error('Gagal membuat transaksi.');
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

/**
 * (Contoh untuk nanti) Mengambil satu produk berdasarkan ID.
 */
export const fetchProductById = async (productId) => {
  // Logika serupa dengan fetchProducts, tapi dengan ID
};