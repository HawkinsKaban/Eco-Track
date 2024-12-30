import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Clock, Globe } from 'lucide-react';
import '../styles/Settings.css';

const Settings = ({ user, onNavigate }) => {
  const defaultProfilePhoto = "../assets/images/Default_pfp.png"; // Path ke gambar default
  const [profileImage, setProfileImage] = useState(defaultProfilePhoto);
  const [updatedUserData, setUpdatedUserData] = useState({});

  useEffect(() => {
    // Ambil gambar profil dan data pengguna dari localStorage
    const storedImage = localStorage.getItem('profileImage');
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedImage) {
      setProfileImage(storedImage);
    }
    if (storedUserData) {
      setUpdatedUserData(storedUserData);
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleEditProfileClick = () => {
    onNavigate('settings-edit'); // Navigasi ke halaman edit profil
  };

  return (
    <div className="settings-container">
      <div className="sidebar">
        <h1 className="sidebar-title">ECO TRACK</h1>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => onNavigate('dashboard')}>Beranda</button>
          <button className="sidebar-link" onClick={() => onNavigate('report')}>Laporan</button>
          <button className="sidebar-link" onClick={() => onNavigate('activities')}>Kegiatan</button>
          <button className="sidebar-link active" onClick={() => onNavigate('settings')}>Setting</button>
        </nav>
      </div>

      <div className="settings-content">
        <h2 className="settings-title">Setting</h2>
        <p className="settings-subtitle">Welcome back, {updatedUserData.fullName || user.username}! Here's what's happening today.</p>

        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-image-container">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-image" 
              />
            </div>

            <div className="profile-info">
              <div className="profile-name-section">
                <h3>{updatedUserData.fullName || user.username}</h3>
                <button className="edit-profile-btn" onClick={handleEditProfileClick}>Edit Profile</button>
              </div>
              <p className="profile-title">{user.role}</p>

              <div className="profile-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{updatedUserData.location || 'Lokasi belum ditambahkan'}</span>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{updatedUserData.email || 'Email belum ditambahkan'}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{updatedUserData.phoneNumber || 'Nomor telepon belum ditambahkan'}</span>
                </div>
                <div className="detail-item">
                  <Globe size={16} />
                  <span>{updatedUserData.website || 'Website belum ditambahkan'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="statistics-section">
          <div className="activity-stats">
            <h4>Activity Statistics</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <h5>{user.reportsSubmitted || 0}</h5>
                <p>Reports Submitted</p>
              </div>
              <div className="stat-item">
                <h5>{user.activitiesJoined || 0}</h5>
                <p>Activities Joined</p>
              </div>
            </div>
          </div>

          <div className="history-activities">
            <h4>History Activities</h4>
            <div className="activity-list">
              {user.activityHistory && user.activityHistory.length > 0 ? (
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
                <p>No activities found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
