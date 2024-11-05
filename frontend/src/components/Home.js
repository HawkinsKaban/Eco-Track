import React from 'react';
import '../styles/Home.css';  // Impor file CSS untuk styling halaman home

function Home() {
  return (
    <div className="home-screen">
      <h1>Selamat Datang di Dashboard Anda</h1>
      <div className="menu">
        <div className="menu-item">
          <a href="#komite">
            <button className="home-button">Komite</button>
          </a>
        </div>
        <div className="menu-item">
          <a href="#akun">
            <button className="home-button">Akun</button>
          </a>
        </div>
        <div className="menu-item">
          <a href="#tanyajawab">
            <button className="home-button">Tanya Jawab</button>
          </a>
        </div>
        <div className="menu-item">
          <a href="#laporan">
            <button className="home-button">Laporan</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
