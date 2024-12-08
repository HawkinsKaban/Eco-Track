import React from 'react';
import '../styles/Dashboard.css';

import Circle1 from '../assets/images/Ellipse 10.png';
import Circle2 from '../assets/images/Ellipse 11.png';
import Circle3 from '../assets/images/Ellipse 12.png';
import Circle4 from '../assets/images/Ellipse 13.png';
import Circle5 from '../assets/images/Ellipse 14.png';
import BackgroundShape from '../assets/images/Rectangle 16.png';

const Dashboard = ({ user, onLogout, onNavigate }) => {
  const stats = [
    { value: '150+', label: 'Laporan Aktif' },
    { value: '500+', label: 'Relawan' },
    { value: '75+', label: 'Kegiatan Selesai' },
  ];

  const notifications = [
    {
      id: 1,
      title: 'Tumpukan sampah di Taman kota',
      location: 'Jl. Amenogawa no.12',
      status: 'Active',
      time: '2 Jam lalu',
      image: '/path-to-image-1.png',
    },
    {
      id: 2,
      title: 'Tumpukan sampah di Gang siber',
      location: 'Jl. Cyber 213',
      status: 'Active',
      time: '1 Jam lalu',
      image: '/path-to-image-2.png',
    },
  ];

  const activities = [
    {
      id: 1,
      type: 'Bersih - bersih Taman',
      location: 'Taman Dayeuhkolot',
      date: 'Senin, 1 November 2024',
      volunteers: 16,
    },
    {
      id: 2,
      type: 'Bersih - bersih Gang',
      location: 'Jl. Cyber 213',
      date: 'Jumat, 1 November 2024',
      volunteers: 10,
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">ECO TRACK</h1>
        <div className="navbar-links-container">
          <ul className="navbar-links">
          <li onClick={() => onNavigate('dashboard')}>Beranda</li>
<li onClick={() => onNavigate('report')}>Laporan</li>
<li onClick={() => onNavigate('activities')}>Kegiatan</li>
<li onClick={() => onNavigate('settings')}>Settings</li>
          </ul>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <img src={BackgroundShape} alt="Background Shape" className="background-shape" />

        {/* Circles Decoration */}
        <img src={Circle1} alt="Circle 1" className="circle circle1" />
        <img src={Circle2} alt="Circle 2" className="circle circle2" />
        <img src={Circle3} alt="Circle 3" className="circle circle3" />
        <img src={Circle4} alt="Circle 4" className="circle circle4" />
        <img src={Circle5} alt="Circle 5" className="circle circle5" />

        <h2>Peduli Lingkungan Bersama</h2>
        <p>Welcome {user.username}! Here's what's happening today.</p>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Notifications and Activities */}
      <div className="activities-grid">
        {/* Notification Section */}
        <div className="notifications-section">
          <div className="section-header">
            <h3>Notifikasi</h3>
            <button onClick={() => onNavigate('notifications')} className="section-link">Lihat Semua</button>
          </div>
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-card">
              <img
                src={notification.image}
                alt={notification.title}
                className="notification-image"
              />
              <div className="notification-details">
                <p className="notification-title">{notification.title}</p>
                <p>{notification.location}</p>
                <p>{notification.time}</p>
              </div>
              <span className={`notification-status ${notification.status.toLowerCase()}`}>{notification.status}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Activities Section */}
        <div className="activities-section">
          <div className="section-header">
            <h3>Kegiatan Mendatang</h3>
          </div>
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <div className="activity-details">
                <h4>{activity.type}</h4>
                <p>{activity.location}</p>
                <p>{activity.date}</p>
              </div>
              <div className="activity-actions">
                <span className="activity-volunteers">{activity.volunteers} relawan</span>
                <button className="activity-join-button" onClick={() => onNavigate('joinActivity')}>Masuk</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
