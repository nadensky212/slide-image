// Lokasi: src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage'; // <-- Import
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import

// Buat komponen dashboard admin sementara
const AdminDashboard = () => <div><h1>Selamat Datang, Admin!</h1><p>Ini adalah halaman dashboard Anda.</p></div>;

function App() {
  return (
    <Router>
      {/* ... Navigasi, Header, dll. ... */}
      <main>
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rute Admin yang Terproteksi */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {/* ... Navigasi Bawah, dll. ... */}
    </Router>
  );
}

export default App;