import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Report from './components/Report';
import Kegiatan from './components/Kegiatan';
import Settings from './components/Settings';
import SettingsEdit from './components/SettingsEdit'; // Import halaman Edit Profile

// Helper functions untuk menyimpan dan mengambil data dari localStorage
const getFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for ${key}:`, error);
    return defaultValue; // Mengembalikan nilai default jika terjadi error
  }
};

const setToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for ${key}:`, error);
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState(getFromLocalStorage('currentPage', 'login'));
  const [users, setUsers] = useState(getFromLocalStorage('users', []));
  const [loggedInUser, setLoggedInUser] = useState(getFromLocalStorage('loggedInUser', null));

  // Simpan state halaman saat ini di localStorage
  useEffect(() => {
    setToLocalStorage('currentPage', currentPage);
  }, [currentPage]);

  // Simpan daftar pengguna di localStorage
  useEffect(() => {
    setToLocalStorage('users', users);
  }, [users]);

  // Simpan atau hapus pengguna yang login di localStorage
  useEffect(() => {
    if (loggedInUser) {
      setToLocalStorage('loggedInUser', loggedInUser);
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [loggedInUser]);

  const handleRegister = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentPage('login');
  };

  const handleLogin = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setLoggedInUser(user);
      setCurrentPage('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    if (page === 'settings' && !loggedInUser) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  const handleSaveUserChanges = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.username === updatedUser.username ? updatedUser : user
    );
    setUsers(updatedUsers);
    setLoggedInUser(updatedUser);
    setCurrentPage('settings');
  };

  return (
    <div>
      {currentPage === 'login' && (
        <Login
          onNavigateToRegister={() => setCurrentPage('register')}
          onLogin={handleLogin}
        />
      )}
      {currentPage === 'register' && (
        <Register
          onNavigateToLogin={() => setCurrentPage('login')}
          onRegister={handleRegister}
        />
      )}
      {currentPage === 'dashboard' && loggedInUser && (
        <Dashboard
          user={loggedInUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'report' && loggedInUser && (
        <Report onNext={() => handleNavigate('dashboard')} onNavigate={handleNavigate} />
      )}
      {currentPage === 'activities' && loggedInUser && (
        <Kegiatan user={loggedInUser} onNavigate={handleNavigate} />
      )}
      {currentPage === 'settings' && loggedInUser && (
        <Settings user={loggedInUser} onNavigate={handleNavigate} />
      )}
      {currentPage === 'settings-edit' && loggedInUser && (
        <SettingsEdit
          user={loggedInUser}
          onNavigate={handleNavigate}
          onSave={handleSaveUserChanges}
        />
      )}
    </div>
  );
};

export default App;
