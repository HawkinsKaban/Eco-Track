import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaBell } from "react-icons/fa";
import "../styles/Dashboard.css";

const Dashboard = ({ user, onLogout, onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk memperbarui data dashboard
  const updateDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reportsResponse, activitiesResponse] = await Promise.all([
        fetch("http://localhost:5000/api/reports?status=active", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch("http://localhost:5000/api/activities", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      if (!reportsResponse.ok || !activitiesResponse.ok) {
        throw new Error(
          `Failed to fetch data: ${
            !reportsResponse.ok ? "Reports " : ""
          }${!activitiesResponse.ok ? "Activities" : ""}`
        );
      }

      const [reportsData, activitiesData] = await Promise.all([
        reportsResponse.json(),
        activitiesResponse.json(),
      ]);

      // Debug log for activities data
      console.log("Raw activities data:", activitiesData);

      // Set notifications data
      if (Array.isArray(reportsData.reports)) {
        setNotifications(
          reportsData.reports.map((report) => ({
            id: report._id,
            title: report.title,
            location: report.location?.address || "Lokasi tidak tersedia",
            time: new Date(report.createdAt).toLocaleTimeString("id-ID"),
            image: report.photos?.[0] || null,
            status: report.status,
          }))
        );
      }

      // Set activities data dengan pengecekan yang lebih ketat
      if (activitiesData.success && Array.isArray(activitiesData.activities)) {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set ke awal hari

        const upcomingActivities = activitiesData.activities
          .filter((activity) => {
            const activityDate = new Date(activity.date);
            activityDate.setHours(0, 0, 0, 0);
            console.log(`Filtering activity: ${activity.title}`, {
              activityDate,
              now,
              isUpcoming: activityDate >= now
            });
            return activityDate >= now;
          })
          .map((activity) => {
            const formattedActivity = {
              id: activity._id,
              title: activity.title,
              location: activity.location?.address || "Lokasi tidak tersedia",
              date: new Date(activity.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              volunteers: activity.totalVolunteers || 0,
            };
            console.log("Formatted activity:", formattedActivity);
            return formattedActivity;
          });

        console.log("Final upcoming activities:", upcomingActivities);
        setActivities(upcomingActivities);
      } else {
        console.error("Invalid activities data structure:", activitiesData);
        setError("Format data aktivitas tidak valid");
      }
    } catch (err) {
      console.error("Error updating dashboard:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Panggil updateDashboardData saat komponen di-mount
  useEffect(() => {
    updateDashboardData();
  }, []);

  const stats = [
    { value: notifications.length || 0, label: "Laporan Aktif" },
    { value: activities.reduce((total, act) => total + (act.volunteers || 0), 0), label: "Relawan" },
    { value: activities.length || 0, label: "Kegiatan Mendatang" },
  ];

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  if (isLoading) return <div className="loading-spinner">Memuat data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">ECO TRACK</h1>
        <div className="navbar-links-container">
          <ul className="navbar-links">
            <li onClick={() => onNavigate("dashboard")}>Beranda</li>
            <li onClick={() => onNavigate("report")}>Laporan</li>
            <li onClick={() => onNavigate("activities")}>Kegiatan</li>
            <li onClick={() => onNavigate("settings")}>Settings</li>
          </ul>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h2>Peduli Lingkungan Bersama</h2>
        <p>Selamat datang kembali, {user.username}! Berikut informasi hari ini.</p>
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

      {/* Main Content */}
      <div className="activities-grid">
        {/* Notifications Section */}
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
          {notifications.length > 0 ? (
            notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="notification-card">
                <img
                  src={notification.image || "/images/default-image.png"}
                  alt={notification.title}
                  className="notification-image"
                  onError={(e) => {
                    e.target.src = "/images/default-image.png";
                  }}
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
            <p className="no-notifications">Tidak ada notifikasi saat ini.</p>
          )}
        </div>

        {/* Activities Section */}
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
                    <p>{activity.date}</p>
                  </div>
                </div>
                <div className="activity-actions">
                  <span className="activity-volunteers">{activity.volunteers} relawan</span>
                  <button
                    className="activity-join-button"
                    onClick={() => onNavigate("joinActivity")}
                  >
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

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Semua Notifikasi</h3>
              <button onClick={handleModalToggle} className="close-modal-btn">
                Tutup
              </button>
            </div>
            <div className="modal-body">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-card">
                  <img
                    src={notification.image || "/images/default-image.png"}
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
