import React, { useState, useEffect } from "react";
import { MapPin, CheckCircle } from "lucide-react";
import "../styles/Kegiatan.css";

const Kegiatan = ({ user, onNavigate, onUpdateNotifications, onUpdateActivities }) => {
  const [reports, setReports] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const today = new Date();

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const daysWithPadding = Array(firstDay).fill(null).concat(days);
    const weeks = [];
    for (let i = 0; i < daysWithPadding.length; i += 7) {
      weeks.push(daysWithPadding.slice(i, i + 7));
    }

    const lastWeek = weeks[weeks.length - 1];
    if (lastWeek.length < 7) {
      const missingDays = 7 - lastWeek.length;
      for (let i = 0; i < missingDays; i++) {
        lastWeek.push(null);
      }
    }

    return weeks;
  };

  const isPastDate = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    return selectedDate < today;
  };

  const handleDateClick = (day) => {
    if (day !== null && !isPastDate(day)) {
      setSelectedDate(day);
    }
  };

  const handleVerify = async () => {
    if (!selectedDate) {
      alert("Pilih tanggal sebelum melakukan verifikasi.");
      return;
    }

    const verifiedDate = new Date(currentYear, currentMonth, selectedDate).toISOString();
    const unverifiedReports = reports.filter(report =>
      report.status === "draft" && !report.verifiedDate
    );

    try {
      setIsLoading(true);

      for (const report of unverifiedReports) {
        await updateReport(report._id, "verified", verifiedDate);
        console.log(`Laporan ${report._id} berhasil diverifikasi`);
      }

      alert(`${unverifiedReports.length} laporan berhasil diverifikasi`);
      await fetchReports();
    } catch (error) {
      console.error("Error verifikasi:", error);
      alert(`Gagal verifikasi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
  
      // Filter laporan yang sudah terverifikasi
      const verifiedReports = reports.filter(report => 
        report.status === "verified" // Hanya cek status verified saja
      );
  
      if (verifiedReports.length === 0) {
        alert("Tidak ada laporan terverifikasi yang dapat dipublikasikan.");
        return;
      }
  
      for (const report of verifiedReports) {
        try {
          // Hapus pengecekan verifiedDate karena tidak perlu
          await updateReport(report._id, "active");
          await createActivity(report);
          console.log(`Berhasil membuat aktivitas untuk laporan ${report._id}`);
        } catch (error) {
          console.error(`Error memproses laporan ${report._id}:`, error);
          alert(`Gagal memproses laporan: ${error.message}`);
          break;
        }
      }
  
      await fetchReports();
      if (onUpdateActivities) {
        await onUpdateActivities();
      }
  
    } catch (error) {
      console.error("Gagal mempublikasikan laporan:", error);
      alert(`Gagal mempublikasikan laporan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReport = async (reportId, status, date = null) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token tidak ditemukan. Harap login ulang.");
    }

    const payload = { status };
    if (date) payload.verifiedDate = date;

    try {
      console.log(`Updating report ${reportId} with status: ${status}`);
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating report:", errorData);
        throw new Error(errorData.error || "Gagal memperbarui status laporan.");
      }

      return await response.json();
    } catch (error) {
      console.error("Update report error:", error.message);
      throw error;
    }
  };

  const createActivity = async (reportData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token tidak ditemukan. Harap login ulang.");
    }
  
    try {
      const activityDate = new Date(reportData.verifiedDate || new Date());
      // Pastikan tanggal valid
      if (isNaN(activityDate.getTime())) {
        throw new Error('Invalid date');
      }
  
      const activityData = {
        title: reportData.title,
        description: reportData.description || "Kegiatan berdasarkan laporan lingkungan",
        location: {
          address: reportData.location?.address || "Alamat tidak tersedia",
          coordinates: Array.isArray(reportData.location?.coordinates) 
            ? reportData.location.coordinates 
            : [0, 0]
        },
        date: activityDate.toISOString(),
        relatedReport: reportData._id,
        status: 'planned'
      };
  
      console.log("Creating activity with data:", JSON.stringify(activityData, null, 2));
  
      const response = await fetch("http://localhost:5000/api/activities", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Gagal membuat aktivitas");
      }
  
      const result = await response.json();
      console.log("Activity created successfully:", result);
      return result;
  
    } catch (error) {
      console.error("Create activity error:", error);
      throw new Error(error.message || "Gagal membuat aktivitas");
    }
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
    setSelectedDate(null);
  };

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching reports...");
      const response = await fetch("http://localhost:5000/api/reports?status=draft,verified", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengambil laporan");
      }

      const data = await response.json();
      console.log("Reports fetched successfully:", data);
      setReports(data.reports || []);
    } catch (error) {
      console.error("Fetch reports error:", error.message);
      setError(error.message || "Gagal memuat laporan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="kegiatan-container">
      <div className="sidebar">
        <h1 className="sidebar-title">ECO TRACK</h1>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => onNavigate("dashboard")}>Beranda</button>
          <button className="sidebar-link" onClick={() => onNavigate("report")}>Laporan</button>
          <button className="sidebar-link active" onClick={() => onNavigate("activities")}>Kegiatan</button>
          <button className="sidebar-link" onClick={() => onNavigate("settings")}>Setting</button>
        </nav>
      </div>

      <div className="kegiatan-content">
        <h2 className="kegiatan-title">Kegiatan</h2>
        <p className="kegiatan-subtitle">Selamat datang kembali, {user.username}!</p>

        <div className="coordinator-section">
          <CheckCircle size={16} />
          <p>Koordinator Kegiatan: {user.username}</p>
        </div>

        <div className="reports-section">
          {isLoading && <div className="loading-overlay">Memuat...</div>}
          {error && <div className="error-message">{error}</div>}
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report._id} className="report-item">
                <img
                  src={
                    report.photos && report.photos.length > 0
                      ? `/api/uploads/general/${report.photos[0].split("\\").pop()}`
                      : "/images/default-image.png"
                  }
                  alt="Laporan"
                  className="report-photo"
                  onError={(e) => {
                    e.target.src = "/images/default-image.png";
                  }}
                />
                <div className="report-details">
                  <h3 className="report-title">{report.title}</h3>
                  <div className="report-location">
                    <MapPin size={16} className="location-icon" />
                    <p>{report.location.address}</p>
                  </div>
                </div>
                <div className="report-status-time">
                  <p className="report-status">{report.status}</p>
                  <p className="report-time">
                    {new Date(report.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            !isLoading && <p>Tidak ada laporan kegiatan.</p>
          )}
        </div>

        <div className="calendar-section">
          <h3 className="calendar-title">
            Pilih Tanggal Kegiatan ({months[currentMonth]} {currentYear})
          </h3>
          <div className="calendar-controls">
            <button
              className="month-button"
              onClick={() => changeMonth(-1)}
            >
              &lt; Prev
            </button>
            <span className="current-month">{months[currentMonth]} {currentYear}</span>
            <button
              className="month-button"
              onClick={() => changeMonth(1)}
            >
              Next &gt;
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
              {generateCalendarDays().map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <td
                      key={dayIndex}
                      className={`calendar-day ${selectedDate === day ? "selected" : ""} ${day === null ? "disabled" : ""}`}
                      onClick={() => day && handleDateClick(day)}
                      style={{
                        backgroundColor: day === null ? "#2f855a" : "",
                        cursor: day === null ? "default" : "pointer",
                      }}
                    >
                      {day || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="action-buttons">
            <button
              className="verify-button"
              onClick={handleVerify}
              disabled={isLoading || !selectedDate}
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi"}
            </button>
          </div>
        </div>

        <button className="publish-button" onClick={handlePublish}>Publikasikan Kegiatan</button>
      </div>
    </div>
  );
};

export default Kegiatan;
