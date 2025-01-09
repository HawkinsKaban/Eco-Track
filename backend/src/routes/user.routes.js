// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware'); // Middleware untuk memeriksa role
const { upload, setUploadType } = require('../config/multer');

// Route: Ambil profil pengguna
router.get(
  '/profile',
  auth, // Pastikan pengguna terautentikasi
  userController.getProfile
);

// Route: Perbarui profil pengguna
router.patch(
  '/profile',
  auth, // Pastikan pengguna terautentikasi
  setUploadType('profiles'), // Tetapkan folder upload untuk gambar profil
  upload.single('profileImage'), // Middleware upload file
  userController.updateProfile
);

// Route: Perbarui role pengguna (khusus admin)
router.patch(
  '/role/:userId',
  auth, // Pastikan pengguna terautentikasi
  checkRole(['admin']), // Hanya admin yang dapat mengakses
  userController.updateUserRole
);

module.exports = router;
