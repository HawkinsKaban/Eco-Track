import React from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
import '../styles/Kegiatan.css';

const Kegiatan = ({ user, onNavigate }) => {
  const reports = [
    {
      id: 1,
      title: 'Tumpukan sampah di Taman kota',
      location: 'Jl. Atmawigena no 12',
      status: 'Active',
      time: '2 Jam lalu',
    },
    {
      id: 2,
      title: 'Tumpukan sampah di Gang siber',
      location: 'Jl. Cyber 213',
      status: 'Active',
      time: '1 Jam lalu',
    },
  ];

  return (
    <div className="kegiatan-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="sidebar-title">ECO TRACK</h1>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => onNavigate('dashboard')}>Beranda</button>
          <button className="sidebar-link" onClick={() => onNavigate('report')}>Laporan</button>
          <button className="sidebar-link active" onClick={() => onNavigate('activities')}>Kegiatan</button>
          <button className="sidebar-link" onClick={() => onNavigate('settings')}>Setting</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="kegiatan-content">
        <h2 className="kegiatan-title">Kegiatan</h2>
        <p className="kegiatan-subtitle">
          Welcome back, {user.username}! Here’s your list of upcoming activities.
        </p>

        {/* Coordinator Section */}
        <div className="coordinator-section">
          <CheckCircle size={16} />
          <p>Koordinator Kegiatan: {user.username}</p>
        </div>

        {/* Reports Section */}
        <div className="reports-section">
          {reports.map((report) => (
            <div key={report.id} className="report-item">
              <div>
                <h3 className="report-title">{report.title}</h3>
                <div className="report-location">
                  <MapPin size={16} className="location-icon" />
                  <p>{report.location}</p>
                </div>
              </div>
              <p className="report-status">{report.status}</p>
              <p className="report-time">{report.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kegiatan;
