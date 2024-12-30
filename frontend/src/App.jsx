import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Report from './components/Report';
import Kegiatan from './components/Kegiatan';
import Settings from './components/Settings';
import SettingsEdit from './components/SettingsEdit';

// Helper functions untuk menyimpan dan mengambil data dari localStorage
const getFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for ${key}:`, error);
    return defaultValue;
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
  const [notifications, setNotifications] = useState(getFromLocalStorage('notifications', []));
  const [activities, setActivities] = useState(getFromLocalStorage('activities', []));

  // Simpan state halaman saat ini di localStorage
  useEffect(() => {
    setToLocalStorage('currentPage', currentPage);
  }, [currentPage]);

  // Simpan daftar pengguna di localStorage
  useEffect(() => {
    setToLocalStorage('users', users);
  }, [users]);

  // Simpan pengguna yang login di localStorage
  useEffect(() => {
    if (loggedInUser) {
      setToLocalStorage('loggedInUser', loggedInUser);
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [loggedInUser]);

  // Simpan data notifikasi di localStorage
  useEffect(() => {
    setToLocalStorage('notifications', notifications);
  }, [notifications]);

  // Simpan data kegiatan di localStorage
  useEffect(() => {
    setToLocalStorage('activities', activities);
  }, [activities]);

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
    if (!loggedInUser && page !== 'login' && page !== 'register') {
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

  const handleUpdateNotifications = (newReports) => {
    const updatedNotifications = newReports.map((report) => ({
      id: report.id,
      title: report.title,
      location: report.location,
      status: report.status,
      time: 'Baru Dipublikasikan',
      image: report.photo || '/default-image.png',
    }));
    setNotifications((prev) => [...prev, ...updatedNotifications]);
  };

  const handleUpdateActivities = (newReports) => {
    const updatedActivities = newReports.map((report) => ({
      id: report.id,
      type: `Kegiatan: ${report.title}`,
      location: report.location,
      date: new Date().toLocaleDateString(),
      volunteers: Math.floor(Math.random() * 50) + 1,
    }));
    setActivities((prev) => [...prev, ...updatedActivities]);
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
          notifications={notifications}
          activities={activities}
        />
      )}
      {currentPage === 'report' && loggedInUser && (
        <Report onNext={() => handleNavigate('dashboard')} onNavigate={handleNavigate} />
      )}
      {currentPage === 'activities' && loggedInUser && (
        <Kegiatan
          user={loggedInUser}
          onNavigate={handleNavigate}
          onUpdateNotifications={handleUpdateNotifications}
          onUpdateActivities={handleUpdateActivities}
        />
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
