const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middleware/auth.middleware'); // Middleware autentikasi
const checkRole = require('../middleware/role.middleware'); // Middleware peran pengguna
const { upload, setUploadType } = require('../config/multer');

// Endpoint untuk membuat laporan baru
router.post(
  '/',
  auth, // Pastikan user sudah login
  upload.array('photos', 5), // Maksimal 5 foto
  reportController.createReport
);

// Endpoint untuk mendapatkan daftar laporan (dengan filter opsional)
router.get(
  '/',
  auth, // Pastikan user sudah login
  reportController.getReports
);

// Endpoint untuk memperbarui laporan (misalnya, verifikasi atau assign)
router.patch(
  '/:id',
  auth, // Pastikan user sudah login
  checkRole(['coordinator', 'admin']), // Hanya role tertentu yang bisa mengupdate
  reportController.updateReport
);

module.exports = router;
