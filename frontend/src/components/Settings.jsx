import React from 'react';
import { MapPin, Mail, Phone, User, Clock } from 'lucide-react'; // Import ikon yang diperlukan
import '../styles/Settings.css'; // Pastikan file CSS diimpor dengan benar

const Settings = ({ user, onNavigate }) => {
  // Pastikan user sudah ada sebelum digunakan
  if (!user) {
    return <div>Loading...</div>; // Menampilkan loading jika data user belum ada
  }

  const handleEditProfileClick = () => {
    onNavigate('settings-edit'); // Navigasi ke halaman edit profile
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="sidebar-title">ECO TRACK</h1>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => onNavigate('dashboard')}>Beranda</button>
          <button className="sidebar-link" onClick={() => onNavigate('report')}>Laporan</button>
          <button className="sidebar-link" onClick={() => onNavigate('activities')}>Kegiatan</button>
          <button className="sidebar-link active" onClick={() => onNavigate('settings')}>Setting</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="settings-content">
        <h2 className="settings-title">Setting</h2>
        <p className="settings-subtitle">Welcome back, {user.username}! Here's what's happening today.</p>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-image-container">
              <img src={user.profileImage || '/profile-image.jpg'} alt="Profile" className="profile-image" />
            </div>

            <div className="profile-info">
              <div className="profile-name-section">
                <h3>{user.username}</h3>
                <button className="edit-profile-btn" onClick={handleEditProfileClick}>Edit Profile</button>
              </div>
              <p className="profile-title">{user.role}</p>

              {/* Profile Details */}
              <div className="profile-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
                <div className="detail-item">
                  <User size={16} />
                  <span>{user.membership}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <div className="activity-stats">
            <h4>Activity Statistics</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <h5>{user.reportsSubmitted}</h5>
                <p>Reports Submitted</p>
              </div>
              <div className="stat-item">
                <h5>{user.activitiesJoined}</h5>
                <p>Activities Joined</p>
              </div>
            </div>
          </div>

          {/* History Activities */}
          <div className="history-activities">
            <h4>History Activities</h4>
            <div className="activity-list">
              {/* Pastikan activityHistory ada dan berupa array */}
              {Array.isArray(user.activityHistory) && user.activityHistory.length > 0 ? (
                user.activityHistory.map((activity, index) => (
                  <div className="activity-item" key={index}>
                    <Clock size={16} />
                    <div className="activity-info">
                      <h5>{activity.location}</h5>
                      <p>{activity.description}</p>
                      <span className="activity-time">{activity.timeAgo}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No activities found</p> // Pesan jika tidak ada aktivitas yang tersedia
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
