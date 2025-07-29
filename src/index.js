// src/index.js

import React, { useState } from 'react'; // <-- Pastikan useState diimpor
import ReactDOM from 'react-dom/client';
import './index.css'; // <-- Ini penting, jangan dihapus
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals'; // <-- Ini juga sebaiknya ada
import PwaUpdateNotifier from './components/PwaUpdateNotifier'; // <-- Impor komponen notifikasi

const root = ReactDOM.createRoot(document.getElementById('root'));

// Komponen Pembungkus (Wrapper) untuk menampung logika PWA
const AppWrapper = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  // Callback ini akan dipanggil oleh serviceWorkerRegistration saat ada update
  const onUpdate = (registration) => {
    setWaitingWorker(registration.waiting);
    setShowUpdate(true);
  };

  // Fungsi yang dijalankan saat tombol "Perbarui" di notifikasi diklik
  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
      window.location.reload();
    }
  };
  
  // Daftarkan service worker dengan callback `onUpdate`
  // Ini adalah perubahan utama dari kode bawaan
  serviceWorkerRegistration.register({ onUpdate });

  return (
    <>
      <App />
      {showUpdate && <PwaUpdateNotifier onUpdate={handleUpdate} />}
    </>
  );
};


// Render komponen AppWrapper, bukan lagi App secara langsung
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);


// Panggilan fungsi ini bisa tetap ada
reportWebVitals();