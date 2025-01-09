import React, { useState } from "react";
import { Camera, Check } from "lucide-react";
import "../styles/Report.css";

const Report = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Fungsi untuk menangani tombol "Lanjutkan"
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

  // Fungsi untuk menangani perubahan foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File yang dipilih:", file);
      setFormData({ ...formData, photo: file });
    }
  };

  // Fungsi untuk mengirim laporan ke server
  const submitReport = async () => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append(
        "location",
        JSON.stringify({
          address: formData.address,
          coordinates: [106.816666, -6.200000], // Sesuaikan dengan data sebenarnya
        })
      );
  
      if (formData.photo) {
        formDataToSend.append("photos", formData.photo);
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login ulang.");
      }
  
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengirim laporan");
      }
  
      const data = await response.json();
      alert("Laporan berhasil dibuat: " + data.message);
      onNavigate("activities"); // Alihkan ke halaman Kegiatan
    } catch (error) {
      console.error("Error submitting report:", error);
      setError("Gagal mengirim laporan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fungsi untuk merender konten setiap langkah
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
                      <p className="upload-text">Klik untuk unggah foto</p>
                    </>
                  ) : (
                    <img src={URL.createObjectURL(formData.photo)} alt="Preview Foto" className="uploaded-photo" />
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
            {isLoading ? (
              <p>Mengirim laporan...</p>
            ) : (
              <>
                <Check className="success-icon" size={32} />
                <h3>Laporan Anda Siap Dikirim</h3>
                <button onClick={submitReport} className="next-button">
                  Kirim Laporan
                </button>
              </>
            )}
            {error && <p className="error-message">{error}</p>}
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
