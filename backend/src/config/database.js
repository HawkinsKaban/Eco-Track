// src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Tambahkan opsi timeout untuk mencegah hanging connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout setelah 5 detik
      socketTimeoutMS: 45000, // Timeout socket setelah 45 detik
    });

    console.log('MongoDB Terhubung ✓');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

  } catch (error) {
    console.error('Error Koneksi MongoDB:');
    console.error(`Message: ${error.message}`);
    
    // Log informasi error tambahan yang berguna
    if (error.code) {
      console.error(`Error Code: ${error.code}`);
    }
    
    // Periksa masalah umum
    if (error.message.includes('authentication failed')) {
      console.error('Kemungkinan username atau password salah');
    } else if (error.message.includes('getaddrinfo')) {
      console.error('Kemungkinan masalah koneksi internet atau URL database salah');
    } else if (error.message.includes('bad auth')) {
      console.error('Kemungkinan kredensial database tidak valid');
    }

    // Log string koneksi (sensor password untuk keamanan)
    const sanitizedUri = process.env.MONGODB_URI.replace(
      /:([^:@]{3})[^:@]*@/, 
      ':***@'
    );
    console.error(`URI yang digunakan: ${sanitizedUri}`);

    process.exit(1);
  }
};

// Tambahkan event listeners untuk koneksi MongoDB
mongoose.connection.on('connected', () => {
  console.log('Mongoose terhubung ke MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose terputus dari MongoDB');
});

// Handle ketika aplikasi ditutup
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Koneksi MongoDB ditutup karena aplikasi ditutup');
    process.exit(0);
  } catch (err) {
    console.error('Error saat menutup koneksi MongoDB:', err);
    process.exit(1);
  }
});

module.exports = connectDB;