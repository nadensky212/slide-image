// src/components/Header.jsx
import { FaDownload } from 'react-icons/fa';
import { usePwaInstall } from '../hooks/usePwaInstall'; // <-- Import hook

const Header = () => {
  const { canInstall, handleInstall } = usePwaInstall(); // <-- Gunakan hook

  return (
    <header className="sticky-header">
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo" />
        <span>Nama Toko</span>
      </div>
      <nav className="header-nav">
        {/* Tombol Install PWA hanya muncul jika bisa diinstal */}
        {canInstall && (
          <button onClick={handleInstall} className="install-button">
            <FaDownload />
            <span>Install App</span>
          </button>
        )}
        {/* Icon Dark Mode dan Info lainnya */}
      </nav>
    </header>
  );
};

export default Header;