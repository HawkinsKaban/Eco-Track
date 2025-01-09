// src/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    default: '', // Default value jika data tidak diisi
  },
  location: {
    type: String,
    default: '', // Default value jika data tidak diisi
  },
  organization: {
    type: String,
    default: '', // Default value jika data tidak diisi
  },
  profileImage: {
    type: String,
    default: '', // Default value untuk gambar profil
  },
  role: {
    type: String,
    enum: ['user', 'volunteer', 'coordinator', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

// Hash password sebelum menyimpan atau memperbarui
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Hash hanya jika password diubah
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Fungsi custom untuk membandingkan password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
