// src/models/activity.model.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
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
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      coordinates: {
        type: [Number], // Format: [longitude, latitude]
        required: [true, 'Coordinates are required'],
        index: '2dsphere', // Untuk mendukung pencarian geospasial
      },
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referensi ke model User
      required: [true, 'Coordinator is required'],
    },
    volunteers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Referensi ke model User
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'], // Status relawan
          default: 'pending',
        },
        joinedAt: {
          type: Date,
          default: Date.now, // Tanggal bergabung otomatis
        },
      },
    ],
    relatedReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report', // Referensi ke model Report
      required: [true, 'Related report is required'], // Pastikan aktivitas terhubung ke laporan
    },
    status: {
      type: String,
      enum: ['planned', 'ongoing', 'completed', 'cancelled'], // Status aktivitas
      default: 'planned', // Default status aktivitas
    },
  },
  {
    timestamps: true, // Menambahkan otomatis `createdAt` dan `updatedAt`
  }
);

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
