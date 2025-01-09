import React, { useState, useEffect } from 'react';
import '../styles/login-register.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Circle1 from '../assets/images/Ellipse 2.png';
import Circle2 from '../assets/images/Ellipse 4.png';
import Circle3 from '../assets/images/Ellipse 7.png';
import Circle4 from '../assets/images/Ellipse 8.png';
import Circle5 from '../assets/images/Ellipse 9.png';

const Register = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fungsi untuk menghapus pesan error ketika user mengetik ulang
  const clearErrorMessage = () => setErrorMessage('');

  // Efek untuk menghilangkan pesan error setelah 3 detik
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Fungsi validasi password
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearErrorMessage();
  };

  // Fungsi untuk registrasi
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Trim semua input
    const trimmedData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
    };

    // Validasi input
    if (!trimmedData.username || !trimmedData.email || !trimmedData.password || !trimmedData.confirmPassword) {
      setErrorMessage('Semua field harus diisi');
      setIsLoading(false);
      return;
    }

    // Validasi format password
    if (!validatePassword(trimmedData.password)) {
      setErrorMessage('Password harus minimal 8 karakter, mengandung huruf, angka, dan simbol khusus');
      setIsLoading(false);
      return;
    }

    // Validasi konfirmasi password
    if (trimmedData.password !== trimmedData.confirmPassword) {
      setErrorMessage('Password tidak cocok');
      setIsLoading(false);
      return;
    }

    try {
      // Kirim request ke API register
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedData.username,
          email: trimmedData.email,
          password: trimmedData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Jika registrasi berhasil
      if (data.success) {
        alert('Registrasi berhasil! Silakan login.');
        onNavigateToLogin();
      } else {
        throw new Error(data.message || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error.message || 'Terjadi kesalahan saat registrasi');
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
        <h2 className="form-title">Register</h2>
        <form className="form" onSubmit={handleRegister}>
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

          {/* Input Email */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            disabled={isLoading}
          />

          {/* Input Password */}
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
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>

          {/* Input Confirm Password */}
          <div className="password-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              disabled={isLoading}
            />
            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>

          {/* Submit Button */}
          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Register'}
          </button>

          {/* Error Message */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>

        {/* Link to Login */}
        <p className="text-center">
          Sudah punya akun?{' '}
          <span className="link-button" onClick={onNavigateToLogin} style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
