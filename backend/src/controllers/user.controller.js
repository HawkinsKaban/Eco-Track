// src/controllers/user.controller.js
const User = require('../models/user.model');

const userController = {
  async updateProfile(req, res) {
    try {
      const updates = req.body;
      const allowedUpdates = ['email', 'phone', 'location', 'organization'];
      
      // Filter out non-allowed updates
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {});

      if (req.file) {
        filteredUpdates.profileImage = req.file.path;
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        filteredUpdates,
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          location: user.location,
          phone: user.phone,
          organization: user.organization
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          location: user.location,
          phone: user.phone,
          organization: user.organization,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Tambahkan fungsi updateUserRole
  async updateUserRole(req, res) {
    try {
      // Validasi role yang diizinkan
      const allowedRoles = ['user', 'volunteer', 'coordinator', 'admin'];
      if (!allowedRoles.includes(req.body.role)) {
        return res.status(400).json({ error: 'Role tidak valid' });
      }

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { role: req.body.role },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }

      res.json({
        success: true,
        message: 'Role user berhasil diupdate',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;