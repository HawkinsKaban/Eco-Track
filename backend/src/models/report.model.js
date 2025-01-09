// src/models/report.model.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true, // Menghapus spasi ekstra di awal/akhir string
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Kerusakan Lingkungan', 'Sampah Limbah'], // Opsi kategori
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
        index: '2dsphere', // Untuk mendukung pencarian geospasial
      },
    },
    photos: {
      type: [String], // Array string untuk menyimpan URL foto
      default: [], // Default adalah array kosong jika tidak ada foto
    },
    status: {
      type: String,
      enum: ['draft', 'verified', 'active'], // Status laporan
      default: 'draft', // Default status adalah 'draft'
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Mengacu pada model User
      required: [true, 'Reporter is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Mengacu pada model User
      default: null, // Default tidak ada user yang ditugaskan
    },
  },
  {
    timestamps: true, // Menambahkan otomatis 'createdAt' dan 'updatedAt'
  }
);

// Membuat model dengan nama 'Report'
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
