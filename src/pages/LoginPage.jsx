// Lokasi: src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = (e) => {
    e.preventDefault();
    // SIMULASI LOGIN
    // Nanti di sini Anda akan memanggil API backend untuk verifikasi
    if (email === 'admin@mail.com' && password === 'password') {
      login('admin'); // Set status login di store
      navigate('/admin/dashboard'); // Arahkan ke dashboard admin
    } else {
      alert('Email atau password salah!');
    }
  };

  return (
    <div className="login-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;