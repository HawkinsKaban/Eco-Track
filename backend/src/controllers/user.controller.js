// src/controllers/user.controller.js
const User = require('../models/user.model');

const userController = {
  // Update Profile
  async updateProfile(req, res) {
    try {
      const updates = req.body;
      const allowedUpdates = ['email', 'phone', 'location', 'organization'];

      // Filter hanya field yang diizinkan
      const filteredUpdates = Object.keys(updates)
        .filter((key) => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {});

      // Tambahkan path file jika ada file yang diunggah
      if (req.file) {
        filteredUpdates.profileImage = `/uploads/profiles/${req.file.filename}`;
      }

      // Perbarui user di database
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: filteredUpdates }, // Gunakan $set untuk menghindari overwrite data lainnya
        { new: true, runValidators: true } // Kembalikan data terbaru dan jalankan validator
      );

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Kembalikan data terbaru
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  },

  // Get Profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  },

  // Update User Role
  async updateUserRole(req, res) {
    try {
      const allowedRoles = ['user', 'volunteer', 'coordinator', 'admin'];
      const { role } = req.body;

      // Validasi role yang diizinkan
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Allowed roles are: ' + allowedRoles.join(', '),
        });
      }

      // Cari user dan perbarui role
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { role },
        { new: true, runValidators: true } // Validasi role
      );

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        user,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  },
};

module.exports = userController;
