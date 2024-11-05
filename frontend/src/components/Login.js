import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';  // Impor CSS untuk halaman login
import Background from '../assets/images/Rectangle 15.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State untuk pesan error
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan atau menyembunyikan password
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "user" && password === "password") {
      setErrorMessage(''); // Kosongkan pesan error jika login berhasil
      navigate('/home');
    } else {
      setErrorMessage('Username atau Password salah!'); // Setel pesan error jika login gagal
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle antara menampilkan dan menyembunyikan password
  };

  return (
    <div className="login-container">
      {/* Gambar latar belakang */}
      <img src={Background} alt="Background" className="background-image" />

      <div className="login-box">
        <h1>WELCOME</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"} // Kondisi untuk menampilkan atau menyembunyikan password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle-password-btn"
            >
              <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i> {/* Gunakan ikon mata */}
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Tampilkan pesan error */}
          <div className="button-container">
            <button className="login-button" type="submit">Login</button>
            <button className="login-button" type="button" onClick={handleSignUp}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
