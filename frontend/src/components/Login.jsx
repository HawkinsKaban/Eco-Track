import React, { useState, useEffect } from 'react';
import '../styles/login-register.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Circle1 from '../assets/images/Ellipse 2.png';
import Circle2 from '../assets/images/Ellipse 4.png';
import Circle3 from '../assets/images/Ellipse 7.png';
import Circle4 from '../assets/images/Ellipse 8.png';
import Circle5 from '../assets/images/Ellipse 9.png';

const Login = ({ onNavigateToRegister, onLogin }) => {
  // State untuk form dan UI
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Efek untuk menghapus pesan error setelah 3 detik
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Handle perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage(''); // Hapus error message saat user mengetik
  };

  // Fungsi untuk login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validasi input
    const trimmedUsername = formData.username.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setErrorMessage('Username dan Password tidak boleh kosong');
      setIsLoading(false);
      return;
    }

    try {
      // Kirim request ke API login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Jika login berhasil
      if (data.success) {
        // Simpan token
        localStorage.setItem('token', data.data.token);

        // Panggil fungsi onLogin dengan data user
        onLogin(data.data.user);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="background-circles">
        <img src={Circle1} alt="Circle 1" className="circle circle1" />
        <img src={Circle2} alt="Circle 2" className="circle circle2" />
        <img src={Circle3} alt="Circle 3" className="circle circle3" />
        <img src={Circle4} alt="Circle 4" className="circle circle4" />
        <img src={Circle5} alt="Circle 5" className="circle circle5" />
      </div>
      
      <div className="form-container">
        <h2 className="form-title">WELCOME</h2>

        <form className="form" onSubmit={handleLogin}>
          {/* Input Username */}
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-input"
            disabled={isLoading}
          />

          {/* Input Password dengan toggle visibility */}
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              disabled={isLoading}
            />
            <span 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>

          {/* Tombol Login */}
          <button 
            type="submit" 
            className="form-button"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>

          {/* Pesan Error */}
          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}
        </form>

        {/* Link ke Register */}
        <p className="text-center">
          Belum punya akun?{' '}
          <span 
            className="link-button" 
            onClick={onNavigateToRegister}
            style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
