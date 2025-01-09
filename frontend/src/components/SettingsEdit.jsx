import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import DefaultPfp from '../assets/images/Default_pfp.png'; // Import gambar default
import '../styles/SettingsEdit.css';

const SettingsEdit = ({ user, onNavigate, fetchProfileData }) => {
  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phoneNumber: user?.phone || '',
    location: user?.location || '',
    organization: user?.organization || '',
  });

  const [profilePhoto, setProfilePhoto] = useState(user?.profileImage || DefaultPfp);
  const [uploadedFile, setUploadedFile] = useState(null); // State untuk file asli
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.username || '',
        email: user.email || '',
        phoneNumber: user.phone || '',
        location: user.location || '',
        organization: user.organization || '',
      });
      setProfilePhoto(user.profileImage || DefaultPfp);
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
      setUploadedFile(file); // Simpan file asli
      const newImage = URL.createObjectURL(file);
      setProfilePhoto(newImage); // Tampilkan preview
    }
  };

  const handleRemovePhoto = () => {
    setUploadedFile(null); // Hapus file asli
    setProfilePhoto(DefaultPfp); // Set foto profil ke default
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { ...formData };

    try {
      const formDataToSend = new FormData();
      Object.keys(updatedUser).forEach((key) => {
        if (updatedUser[key]) formDataToSend.append(key, updatedUser[key]);
      });

      if (uploadedFile) {
        formDataToSend.append('profileImage', uploadedFile);
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Gagal mengupdate profil');

      alert('Profil berhasil diperbarui');

      // Panggil ulang data profil setelah berhasil update
      if (fetchProfileData) {
        await fetchProfileData(); // Refresh data di Settings
      }
      onNavigate('settings'); // Kembali ke halaman settings
    } catch (error) {
      alert(error.message || 'Terjadi kesalahan');
    }
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
            Welcome back, {formData.fullName || 'User'}! Here’s what’s happening today.
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
              <p>Upload a new profile photo or remove the current one</p>
            </div>
            <button
              type="button"
              className="remove-photo-btn"
              onClick={handleRemovePhoto}
            >
              Remove Photo
            </button>
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
            </div>

            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsEdit;
