import React, { useState } from 'react';
import { Camera, Check } from 'lucide-react';
import '../styles/Report.css';

const Report = ({ onNext, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Kerusakan Lingkungan',
    description: '',
    photo: null,
    address: '',
    addressDetail: ''
  });

  const steps = [
    { number: 1, label: 'Detail', active: currentStep >= 1 },
    { number: 2, label: 'Foto', active: currentStep >= 2 },
    { number: 3, label: 'Lokasi', active: currentStep >= 3 },
    { number: 4, label: 'Selesai', active: currentStep >= 4 }
  ];

  const handleNext = () => {
    // Validation for Step 1
    if (currentStep === 1 && (!formData.title || !formData.description)) {
      alert("Semua bidang harus diisi pada langkah pertama.");
      return;
    }
    // Validation for Step 3
    if (currentStep === 3 && !formData.address) {
      alert("Alamat harus diisi pada langkah ketiga.");
      return;
    }
    // If at the last step, send data to `onNext`
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext(formData); // Send data when at the last step
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: URL.createObjectURL(file) });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="form-group">
              <label>Laporan Masalah</label>
              <input
                type="text"
                placeholder="Contoh: Sampah di gang siber"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option value="Kerusakan Lingkungan">Kerusakan Lingkungan</option>
                <option value="Sampah Limbah">Sampah Limbah</option>
              </select>
            </div>
            <div className="form-group">
              <label>Deskripsi Masalah</label>
              <textarea
                placeholder="Detail Masalah"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
              />
            </div>
            <button className="next-button" onClick={handleNext}>Lanjutkan</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-medium mb-4">Upload Foto</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <Camera size={48} className="text-gray-400 mb-4" />
                {formData.photo && (
                  <img src={formData.photo} alt="Preview" className="max-w-full h-auto rounded-lg" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="input-file"
                />
              </div>
            </div>
            <button onClick={handleNext} className="next-button">Lanjutkan</button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="form-group">
              <label>Alamat Tujuan</label>
              <input
                type="text"
                placeholder="Jl. Atmawigena no 12"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Deskripsi Alamat</label>
              <textarea
                placeholder="Jl. Atmawigena no 12, jalan terus melewati gang..."
                value={formData.addressDetail}
                onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                className="input-field"
              />
            </div>
            <button className="next-button" onClick={handleNext}>Lanjutkan</button>
          </div>
        );
      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-medium">Laporan Anda Berhasil Dikirim</h3>
            <p className="text-gray-600">Terima kasih atas kontribusi Anda dalam menjaga lingkungan.</p>
            <button onClick={() => setCurrentStep(1)} className="next-button">Selesai</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="sidebar-title">ECO TRACK</h1>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => onNavigate('dashboard')}>Beranda</button>
          <button className="sidebar-link active" onClick={() => onNavigate('report')}>Laporan</button>
          <button className="sidebar-link" onClick={() => onNavigate('activities')}>Kegiatan</button>
          <button className="sidebar-link" onClick={() => onNavigate('settings')}>Setting</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="settings-content">
        <h2 className="settings-title">Laporan</h2>
        <p className="settings-subtitle">Pilih kategori masalah, upload foto, dan tentukan lokasi masalah.</p>

        {/* Progress Bar */}
        <div className="progress-bar">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`progress-step ${step.active ? 'active' : ''}`}>{step.number}</div>
              {index < steps.length - 1 && <div className={`progress-line ${steps[index + 1].active ? 'active' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Report;
