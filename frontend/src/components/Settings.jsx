import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Clock, Globe } from 'lucide-react';
import DefaultPfp from '../assets/images/Default_pfp.png';
import '../styles/Settings.css';

const Settings = ({ onNavigate }) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data profil
  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');

      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data profil');
      }

      const data = await response.json();
      setProfileData(data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message || 'Gagal memuat data profil');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (isLoading) return <div>Memuat...</div>;
  if (error) return <div>{error}</div>;

  const handleEditProfileClick = () => {
    onNavigate('settings-edit', { user: profileData, fetchProfileData }); // Kirim data dan fungsi ke SettingsEdit
  };

  const profileImageURL = profileData?.profileImage
    ? `http://localhost:5000${profileData.profileImage}`
    : DefaultPfp;

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
        <p className="settings-subtitle">
          Welcome back, {profileData?.username || 'User'}! Here's your profile information.
        </p>

        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-image-container">
              <img
                src={profileImageURL}
                alt="Profile"
                className="profile-image"
              />
            </div>

            <div className="profile-info">
              <div className="profile-name-section">
                <h3>{profileData?.username || 'USERNAME'}</h3>
                <button className="edit-profile-btn" onClick={handleEditProfileClick}>Edit Profile</button>
              </div>
              {/* Perubahan untuk memastikan role selalu tampil kapital */}
              <p className="profile-title">{profileData?.role?.toUpperCase() || 'ROLE'}</p>

              <div className="profile-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{profileData?.location || 'Lokasi belum ditambahkan'}</span>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{profileData?.email || 'Email belum ditambahkan'}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{profileData?.phone || 'Nomor telepon belum ditambahkan'}</span>
                </div>
                <div className="detail-item">
                  <Globe size={16} />
                  <span>{profileData?.organization || 'Organisasi belum ditambahkan'}</span>
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
                <h5>{profileData?.reportsSubmitted || 0}</h5>
                <p>Reports Submitted</p>
              </div>
              <div className="stat-item">
                <h5>{profileData?.activitiesJoined || 0}</h5>
                <p>Activities Joined</p>
              </div>
            </div>
          </div>

          <div className="history-activities">
            <h4>History Activities</h4>
            <div className="activity-list">
              {profileData?.activityHistory && profileData.activityHistory.length > 0 ? (
                profileData.activityHistory.map((activity, index) => (
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
