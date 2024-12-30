import React, { useState } from "react";
import { Camera, Check } from "lucide-react";
import "../styles/Report.css";

const Report = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "Kerusakan Lingkungan",
    description: "",
    photo: null,
    address: "",
    addressDetail: "",
  });

  const steps = [
    { number: 1, label: "Detail", active: currentStep >= 1 },
    { number: 2, label: "Foto", active: currentStep >= 2 },
    { number: 3, label: "Lokasi", active: currentStep >= 3 },
    { number: 4, label: "Selesai", active: currentStep >= 4 },
  ];

  const handleNext = () => {
    if (currentStep === 1 && (!formData.title || !formData.description)) {
      alert("Semua bidang harus diisi pada langkah pertama.");
      return;
    }
    if (currentStep === 2 && !formData.photo) {
      alert("Gambar harus diunggah pada langkah kedua.");
      return;
    }
    if (currentStep === 3 && !formData.address) {
      alert("Alamat harus diisi pada langkah ketiga.");
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: URL.createObjectURL(file) });
    }
  };

  const handleSubmitReport = () => {
    const newReport = {
      id: Date.now(),
      title: formData.title,
      location: formData.address,
      status: "Draft", // Ubah status menjadi Draft
      time: new Date().toLocaleTimeString(),
      photo: formData.photo,
    };
  
    const existingReports = JSON.parse(localStorage.getItem("reports")) || [];
    const updatedReports = [...existingReports, newReport];
  
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    alert("Laporan berhasil dibuat! Silakan publikasikan di halaman Kegiatan.");
    onNavigate("activities"); // Arahkan pengguna ke halaman Kegiatan
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
            <button className="next-button" onClick={handleNext}>
              Lanjutkan
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3>Upload Foto</h3>
              <div
                className="upload-container"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <div>
                  {!formData.photo ? (
                    <>
                      <Camera className="upload-icon" />
                      <p className="upload-text">Klik untuk unggah foto atau tarik file ke sini</p>
                    </>
                  ) : (
                    <div>
                      <img src={formData.photo} alt="Preview Foto" className="max-w-full h-auto" />
                      <button
                        className="clear-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, photo: null });
                        }}
                      >
                        Hapus Foto
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleNext} className="next-button">
              Lanjutkan
            </button>
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
                placeholder="Detail Alamat"
                value={formData.addressDetail}
                onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                className="input-field"
              />
            </div>
            <button className="next-button" onClick={handleNext}>
              Lanjutkan
            </button>
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
            <h3>Laporan Anda Berhasil Dikirim</h3>
            <p>Terima kasih atas kontribusi Anda dalam menjaga lingkungan.</p>
            <button onClick={handleSubmitReport} className="next-button">
              Selesai
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="sidebar">
        <h1 className="sidebar-title">ECO TRACK</h1>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => onNavigate("dashboard")}>
            Beranda
          </button>
          <button className="sidebar-link active" onClick={() => onNavigate("report")}>
            Laporan
          </button>
          <button className="sidebar-link" onClick={() => onNavigate("activities")}>
            Kegiatan
          </button>
          <button className="sidebar-link" onClick={() => onNavigate("settings")}>
            Setting
          </button>
        </nav>
      </div>
      <div className="settings-content">
        <h2 className="settings-title">Laporan</h2>
        <p className="settings-subtitle">
          Pilih kategori masalah, upload foto, dan tentukan lokasi masalah.
        </p>
        <div className="progress-bar">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="progress-step-container">
                <div className={`progress-step ${step.active ? "active" : ""}`}>
                  {step.number}
                </div>
                <p className="progress-label">{step.label}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`progress-line ${steps[index + 1].active ? "active" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Report;
