import React, { useState, useEffect } from "react";
import { MapPin, CheckCircle } from "lucide-react";
import "../styles/Kegiatan.css";

const Kegiatan = ({ user, onNavigate, onUpdateNotifications, onUpdateActivities }) => {
  const [reports, setReports] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleVerify = () => {
    if (!selectedDate) {
      alert("Pilih tanggal sebelum melakukan verifikasi.");
      return;
    }

    const verifiedDate = new Date(currentYear, currentMonth, selectedDate).toISOString();
    alert(
      `Tanggal ${new Date(verifiedDate).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })} telah diverifikasi.`
    );     

    // Simpan tanggal terverifikasi ke localStorage
    localStorage.setItem("verifiedDate", JSON.stringify({ date: verifiedDate }));
  };

  const handlePublish = () => {
    if (reports.length === 0) {
      alert("Tidak ada laporan yang dapat dipublikasikan.");
      return;
    }
  
    // Ambil tanggal terverifikasi dari localStorage
    const verifiedDate = JSON.parse(localStorage.getItem("verifiedDate"))?.date;
  
    if (!verifiedDate) {
      alert("Pilih tanggal terlebih dahulu sebelum mempublikasikan.");
      return;
    }
  
    // Ubah status laporan menjadi "Active" dan tambahkan tanggal terverifikasi
    const updatedReports = reports.map((report) => ({
      ...report,
      status: "Active",
      verifiedDate, // Tambahkan tanggal terverifikasi
    }));
  
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
    const mergedReports = [
      ...storedReports.filter((report) => !updatedReports.some((r) => r.id === report.id)),
      ...updatedReports,
    ];
  
    localStorage.setItem("reports", JSON.stringify(mergedReports));
    setReports([]);
    alert("Laporan berhasil dipublikasikan! Laporan akan muncul di Dashboard.");
  };
  
  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
    // Muat laporan dengan status Draft
    const draftReports = storedReports.filter((report) => report.status === "Draft");
    setReports(draftReports);
  }, []);  
  
  return (
    <div className="kegiatan-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="sidebar-title">ECO TRACK</h1>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => onNavigate("dashboard")}>
            Beranda
          </button>
          <button className="sidebar-link" onClick={() => onNavigate("report")}>
            Laporan
          </button>
          <button className="sidebar-link active" onClick={() => onNavigate("activities")}>
            Kegiatan
          </button>
          <button className="sidebar-link" onClick={() => onNavigate("settings")}>
            Setting
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="kegiatan-content">
        <h2 className="kegiatan-title">Kegiatan</h2>
        <p className="kegiatan-subtitle">
          Selamat datang kembali, {user.username}!
        </p>

        {/* Koordinator Section */}
        <div className="coordinator-section">
          <CheckCircle size={16} />
          <p>Koordinator Kegiatan: {user.username}</p>
        </div>

        {/* Reports Section */}
        <div className="reports-section">
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <div key={index} className="report-item">
                {/* Gambar */}
                <img src={report.photo} alt="Laporan" className="report-photo" />

                {/* Detail Laporan */}
                <div className="report-details">
                  <h3 className="report-title">{report.title}</h3>
                  <div className="report-location">
                    <MapPin size={16} className="location-icon" />
                    <p>{report.location}</p>
                  </div>
                </div>

                {/* Status dan Waktu */}
                <div className="report-status-time">
                  <p className="report-status">{report.status}</p>
                  <p className="report-time">{report.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Tidak ada laporan kegiatan.</p>
          )}
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          <h3 className="calendar-title">
            Pilih Tanggal Kegiatan ({months[currentMonth]} {currentYear})
          </h3>
          <div className="calendar-controls">
            <button className="month-button" onClick={() => changeMonth(-1)}>
              &lt;
            </button>
            <span className="current-month">
              {months[currentMonth]} {currentYear}
            </span>
            <button className="month-button" onClick={() => changeMonth(1)}>
              &gt;
            </button>
          </div>
          <table className="calendar">
            <thead>
              <tr>
                <th>Minggu</th>
                <th>Senin</th>
                <th>Selasa</th>
                <th>Rabu</th>
                <th>Kamis</th>
                <th>Jumat</th>
                <th>Sabtu</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, weekIndex) => (
                <tr key={weekIndex}>
                  {generateCalendarDays()
                    .slice(weekIndex * 7, weekIndex * 7 + 7)
                    .map((day) => (
                      <td
                        key={day}
                        className={`calendar-day ${selectedDate === day ? "selected" : ""}`}
                        onClick={() => handleDateClick(day)}
                      >
                         {day}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="action-buttons">
            <button className="verify-button" onClick={handleVerify} disabled={!selectedDate}>
              Verifikasi
            </button>
          </div>
        </div>

        {/* Publish Button */}
        <button className="publish-button" onClick={handlePublish}>
          Publikasikan Kegiatan
        </button>
      </div>
    </div>
  );
};

export default Kegiatan;
