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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk menghapus pesan error saat user mengetik ulang
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

  // Fungsi untuk menangani login
  const handleLogin = (e) => {
    e.preventDefault();

    // Trim input sebelum dikirim ke fungsi onLogin
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setErrorMessage('Username dan Password tidak boleh kosong');
      return;
    }

    const isValid = onLogin(trimmedUsername, trimmedPassword);
    if (!isValid) {
      setErrorMessage('Invalid username or password');
    } else {
      setErrorMessage('');
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
          <button type="submit" className="form-button">Login</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <p className="text-center">
          Belum punya akun?{' '}
          <span className="link-button" onClick={onNavigateToRegister}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
