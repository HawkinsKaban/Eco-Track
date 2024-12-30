import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaBell } from "react-icons/fa"; // Menambahkan FaBell
import "../styles/Dashboard.css";

const Dashboard = ({ user, onLogout, onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false); // State untuk kontrol modal

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];

    const relevantReports = storedReports.filter(
      (report) => report.status === "Active" || report.status === "Published"
    );

    // Mengurutkan laporan berdasarkan waktu terbaru
    relevantReports.sort((a, b) => new Date(b.time) - new Date(a.time)); // Mengurutkan dari yang terbaru

    setNotifications(
      relevantReports.map((report) => ({
        id: report.id,
        title: report.title,
        location: report.location,
        time: new Date(report.time).toLocaleTimeString("id-ID"),
        image: report.photo,
        status: report.status,
      }))
    );

    setActivities(
      relevantReports.map((report) => ({
        ...report,
        time: report.verifiedDate
          ? new Date(report.verifiedDate).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          : new Date(report.time).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
      }))
    );
  }, []);

  const stats = [
    { value: notifications.length, label: "Laporan Aktif" },
    { value: "500+", label: "Relawan" },
    { value: activities.length, label: "Kegiatan Mendatang" },
  ];

  const handleModalToggle = () => {
    setShowModal(!showModal); // Toggle modal visibility
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1 className="navbar-title">ECO TRACK</h1>
        <div className="navbar-links-container">
          <ul className="navbar-links">
            <li onClick={() => onNavigate("dashboard")}>Beranda</li>
            <li onClick={() => onNavigate("report")}>Laporan</li>
            <li onClick={() => onNavigate("activities")}>Kegiatan</li>
            <li onClick={() => onNavigate("settings")}>Settings</li>
          </ul>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <header className="hero-section">
        <h2>Peduli Lingkungan Bersama</h2>
        <p>Selamat datang kembali, {user.username}! Berikut informasi hari ini.</p>
      </header>

      <section className="stats-section">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </section>

      <div className="activities-grid">
        <div className="notifications-section">
          <div className="section-header">
            <div className="section-header-title">
              <FaBell size={20} className="bell-icon" />
              <h3>Notifikasi</h3>
            </div>
            <button onClick={handleModalToggle} className="section-link">
              Lihat Semua
            </button>
          </div>

          {/* Cek apakah ada notifikasi */}
          {notifications.length > 0 ? (
            notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="notification-card">
                <img
                  src={notification.image || "/default-image.png"}
                  alt={notification.title}
                  className="notification-image"
                />
                <div className="notification-details">
                  <p className="notification-title">{notification.title}</p>
                  <p className="notification-location">{notification.location}</p>
                </div>
                <div className="notification-meta">
                  <p className="notification-status">{notification.status}</p>
                  <p className="notification-time">{notification.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-notifications">Tidak ada notifikasi saat ini.</p> // Pesan jika tidak ada notifikasi
          )}
        </div>

        {/* Kegiatan Mendatang */}
        <div className="activities-section">
          <div className="section-header">
            <h3>Kegiatan Mendatang</h3>
          </div>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="activity-card">
                <div className="activity-details">
                  <p className="activity-title">{activity.title}</p>
                  <div className="activity-location">
                    <FaMapMarkerAlt size={16} className="location-icon" />
                    <p>{activity.location}</p>
                  </div>
                  <div className="activity-time">
                    <FaCalendarAlt size={16} className="calendar-icon" />
                    <p>{activity.time}</p>
                  </div>
                </div>
                <div className="activity-actions">
                  <span className="activity-volunteers">{activity.volunteers} relawan</span>
                  <button className="activity-join-button" onClick={() => onNavigate("joinActivity")}>
                    Masuk
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-activity">Tidak ada kegiatan mendatang</p>
          )}
        </div>
      </div>

      {/* Modal untuk menampilkan semua laporan */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Semua Notifikasi</h3>
              <button onClick={handleModalToggle} className="close-modal-btn">Tutup</button>
            </div>
            <div className="modal-body">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-card">
                  <img
                    src={notification.image || "/default-image.png"}
                    alt={notification.title}
                    className="notification-image"
                  />
                  <div className="notification-details">
                    <p className="notification-title">{notification.title}</p>
                    <p className="notification-location">{notification.location}</p>
                  </div>
                  <div className="notification-meta">
                    <p className="notification-status">{notification.status}</p>
                    <p className="notification-time">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
