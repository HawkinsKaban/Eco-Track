import React, { useState, useEffect } from 'react';
import '../styles/login-register.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Circle1 from '../assets/images/Ellipse 2.png';
import Circle2 from '../assets/images/Ellipse 4.png';
import Circle3 from '../assets/images/Ellipse 7.png';
import Circle4 from '../assets/images/Ellipse 8.png';
import Circle5 from '../assets/images/Ellipse 9.png';

const Register = ({ onNavigateToLogin, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  // Fungsi untuk menangani registrasi
  const handleRegister = (e) => {
    e.preventDefault();

    // Trim semua input
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Validasi input
    if (!trimmedUsername || !trimmedPassword || !trimmedConfirmPassword) {
      setErrorMessage('Semua kolom harus diisi.');
      return;
    }

    if (!validatePassword(trimmedPassword)) {
      setErrorMessage('Password harus minimal 8 karakter, mengandung huruf, angka, dan simbol khusus.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setErrorMessage('Password tidak cocok.');
      return;
    }

    // Jika validasi berhasil, panggil fungsi onRegister
    onRegister({ username: trimmedUsername, password: trimmedPassword });
    setErrorMessage('');
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
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearErrorMessage();
            }}
            className="form-input"
          />

          {/* Input Password */}
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrorMessage();
              }}
              className="form-input"
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
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearErrorMessage();
              }}
              className="form-input"
            />
            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>

          {/* Tombol Register */}
          <button type="submit" className="form-button">Register</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>

        {/* Link untuk kembali ke halaman login */}
        <p className="text-center">
          Sudah punya akun?{' '}
          <span className="link-button" onClick={onNavigateToLogin}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
