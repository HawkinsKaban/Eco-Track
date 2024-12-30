import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import '../styles/SettingsEdit.css';

const SettingsEdit = ({ user, onNavigate }) => {
  const defaultProfilePhoto = "../assets/images/Default_pfp.png"; // Path ke gambar default

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
    organization: user?.organization || '',
    website: user?.website || '',
  });

  const [profilePhoto, setProfilePhoto] = useState(
    localStorage.getItem('profileImage') || defaultProfilePhoto
  );

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        organization: user.organization,
        website: user.website,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setProfilePhoto(newImage);
      localStorage.setItem('profileImage', newImage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...formData, profilePhoto };
    localStorage.setItem('userData', JSON.stringify(updatedUser)); // Simpan data ke localStorage
    onNavigate('settings'); // Navigasi kembali ke halaman Settings
  };

  return (
    <div className="settings-edit-container">
      <div className="sidebar">
        <h1 className="sidebar-title">ECO TRACK</h1>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => onNavigate('dashboard')}>Beranda</button>
          <button className="sidebar-link" onClick={() => onNavigate('report')}>Laporan</button>
          <button className="sidebar-link" onClick={() => onNavigate('activities')}>Kegiatan</button>
          <button className="sidebar-link active" onClick={() => onNavigate('settings')}>Setting</button>
        </nav>
      </div>

      <div className="settings-edit-content">
        <div className="settings-edit-header">
          <h2 className="settings-edit-title">Edit Profile</h2>
          <p className="settings-edit-subtitle">
            Welcome back, {formData.fullName || user?.username}! Here’s what’s happening today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="settings-edit-form">
          <div className="profile-photo-section">
            <div className="profile-photo-container">
              <img src={profilePhoto} alt="Profile" className="profile-photo" />
              <button
                type="button"
                className="photo-upload-icon"
                onClick={() => fileInputRef.current.click()}
              >
                <Camera size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="profile-photo-text">
              <h3>Profile Photo</h3>
              <p>Upload a new profile photo</p>
            </div>
            <div className="form-footer">
              <button type="submit" className="done-btn">Selesai</button>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label htmlFor="organization">Organization</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsEdit;
