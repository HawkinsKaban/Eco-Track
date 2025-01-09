import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Report from './components/Report';
import Kegiatan from './components/Kegiatan';
import Settings from './components/Settings';
import SettingsEdit from './components/SettingsEdit';

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
  const [loggedInUser, setLoggedInUser] = useState(getFromLocalStorage('loggedInUser', null));
  const [reports, setReports] = useState(getFromLocalStorage('reports', []));
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Gagal memuat profil');

      const data = await response.json();
      setLoggedInUser(data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Gagal memuat profil pengguna. Silakan login ulang.');
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak tersedia');

      const [reportsResponse, activitiesResponse] = await Promise.all([
        fetch('http://localhost:5000/api/reports?status=active', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/activities', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!reportsResponse.ok || !activitiesResponse.ok) {
        throw new Error('Gagal memuat data dashboard');
      }

      const [reportsData, activitiesData] = await Promise.all([
        reportsResponse.json(),
        activitiesResponse.json(),
      ]);

      setNotifications(
        reportsData.reports.map((report) => ({
          id: report._id,
          title: report.title,
          location: report.location?.address || 'Lokasi tidak tersedia',
          status: report.status,
          time: new Date(report.createdAt).toLocaleTimeString('id-ID'),
          image: report.photos[0],
        }))
      );

      setActivities(
        activitiesData.activities.map((activity) => ({
          id: activity._id,
          title: activity.title,
          location: activity.location?.address || 'Lokasi tidak tersedia',
          date: new Date(activity.date).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          volunteers: activity.volunteers.length,
        }))
      );
    } catch (error) {
      console.error('Gagal memperbarui data dashboard:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedPage = getFromLocalStorage('currentPage', 'login');

    if (token) {
      fetchUserProfile(token).then(() => {
        setCurrentPage(savedPage);
        updateDashboardData();
      });
    } else {
      setCurrentPage(savedPage);
    }
  }, [fetchUserProfile, updateDashboardData]);

  useEffect(() => {
    setToLocalStorage('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (loggedInUser) {
      setToLocalStorage('loggedInUser', loggedInUser);
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [loggedInUser]);

  useEffect(() => {
    setToLocalStorage('reports', reports);
  }, [reports]);

  const handleLogin = (userData) => {
    setLoggedInUser(userData);
    setCurrentPage('dashboard');
    updateDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {currentPage === 'login' && (
        <Login
          onNavigateToRegister={() => setCurrentPage('register')}
          onLogin={handleLogin}
        />
      )}
      {currentPage === 'register' && (
        <Register onNavigateToLogin={() => setCurrentPage('login')} />
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
      {currentPage === 'report' && loggedInUser && <Report onNavigate={handleNavigate} />}
      {currentPage === 'activities' && loggedInUser && (
        <Kegiatan
          user={loggedInUser}
          onNavigate={handleNavigate}
          onUpdateNotifications={updateDashboardData}
          onUpdateActivities={updateDashboardData}
          reports={reports}
          setReports={setReports}
        />
      )}
      {currentPage === 'settings' && loggedInUser && (
        <Settings user={loggedInUser} onNavigate={handleNavigate} />
      )}
      {currentPage === 'settings-edit' && loggedInUser && (
        <SettingsEdit user={loggedInUser} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;
