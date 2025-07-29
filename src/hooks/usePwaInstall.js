// src/hooks/usePwaInstall.js
import { useState, useEffect } from 'react';

export const usePwaInstall = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Cek apakah aplikasi sudah berjalan dalam mode standalone (terinstal)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired');
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsAppInstalled(true); // Sembunyikan tombol setelah instal
      setInstallPrompt(null);
    }
  };

  // Tampilkan tombol hanya jika prompt ada dan aplikasi belum terinstal
  const canInstall = !!installPrompt && !isAppInstalled;

  return { canInstall, handleInstall };
};