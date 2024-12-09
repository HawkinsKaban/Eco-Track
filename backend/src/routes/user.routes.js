// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware'); // Tambahkan import ini
const upload = require('../config/multer');

// Route yang sudah ada
router.get('/profile', 
  auth, 
  userController.getProfile
);

router.patch('/profile',
  auth,
  upload.single('profileImage'),
  userController.updateProfile
);

// Route untuk update role
router.patch('/role/:userId',
  auth,
  checkRole(['admin']), // Sekarang checkRole sudah bisa digunakan
  userController.updateUserRole
);

module.exports = router;