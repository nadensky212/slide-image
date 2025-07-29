// Lokasi file: netlify/functions/api.js

const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const admin = require('firebase-admin');
const midtransClient = require('midtrans-client');
const API_BASE_URL = '/api'


// --- Inisialisasi Service Pihak Ketiga ---

// 1. Inisialisasi Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

// 2. Inisialisasi Midtrans Snap API
const snap = new midtransClient.Snap({
    isProduction : false, // Ganti ke `true` saat sudah live
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : process.env.MIDTRANS_CLIENT_KEY
});

// --- Pengaturan Aplikasi Express ---

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// --- Endpoint API ---

/**
 * Endpoint untuk mengambil data publik (produk, pengaturan toko, dll.)
 */
router.get('/products', async (req, res) => {
  try {
    const productsSnapshot = await db.collection('products').where('isActive', '==', true).get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil produk", error: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
    try {
      const doc = await db.collection('products').doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }
      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil detail produk", error: error.message });
    }
});

router.get('/settings', async (req, res) => {
    try {
        const doc = await db.collection('settings').doc('storeConfig').get();
        if (!doc.exists) {
            return res.status(404).json({ message: "Pengaturan toko tidak ditemukan" });
        }
        res.status(200).json(doc.data());
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil pengaturan toko", error: error.message });
    }
});


/**
 * Endpoint untuk Pembayaran Midtrans
 */
router.post('/create-transaction', async (req, res) => {
  try {
    const { orderId, totalAmount, items, customerDetails } = req.body;
    
    // 1. Simpan data pesanan awal ke Firestore dengan status "pending"
    await db.collection('orders').doc(orderId).set({
      ...req.body,
      paymentStatus: 'pending',
      createdAt: new Date(),
    });

    // 2. Buat parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      item_details: items, // array of items [{id, price, quantity, name}]
      customer_details: customerDetails, // {first_name, email, phone}
    };

    // 3. Buat transaksi di Midtrans
    const transaction = await snap.createTransaction(parameter);
    
    // 4. Kirim token transaksi ke frontend
    res.status(201).json(transaction);

  } catch (error) {
    res.status(500).json({ message: "Gagal membuat transaksi", error: error.message });
  }
});

/**
 * Endpoint untuk menangani notifikasi dari Midtrans (Webhook)
 */
router.post('/notification-handler', async (req, res) => {
  try {
    const notificationJson = req.body;
    const statusResponse = await snap.transaction.notification(notificationJson);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaksi diterima: ID ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

    const orderRef = db.collection('orders').doc(orderId);
    let newPaymentStatus = 'pending';

    // Logika untuk update status pesanan di Firestore
    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
        if (fraudStatus == 'accept') {
            newPaymentStatus = 'paid';
        }
    } else if (transactionStatus == 'deny' || transactionStatus == 'expire' || transactionStatus == 'cancel') {
        newPaymentStatus = 'failed';
    }

    // Update status pembayaran di Firestore
    await orderRef.update({ paymentStatus: newPaymentStatus, midtransResponse: statusResponse });

    // Kirim konfirmasi ke Midtrans bahwa notifikasi sudah diterima
    res.status(200).send('OK');

  } catch (error) {
    console.error("Gagal menangani notifikasi:", error.message);
    res.status(500).json({ message: "Gagal menangani notifikasi", error: error.message });
  }
});


// --- Bagian Wajib untuk Netlify ---

app.use('/api/', router);
module.exports.handler = serverless(app);