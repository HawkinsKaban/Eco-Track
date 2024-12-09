// src/controllers/report.controller.js
const Report = require('../models/report.model');
const Notification = require('../models/notification.model');

const reportController = {
  async createReport(req, res) {
    try {
      const { title, description, category, location } = req.body;
      const photos = req.files ? req.files.map(file => file.path) : [];

      const report = new Report({
        title,
        description,
        category,
        location: JSON.parse(location),
        photos,
        reporter: req.user.id
      });

      await report.save();

      // Create notification for admins
      // Implementation of notification creation here

      res.status(201).json({
        message: 'Report created successfully',
        report
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getReports(req, res) {
    try {
      const { status, category } = req.query;
      const query = {};

      if (status) query.status = status;
      if (category) query.category = category;

      const reports = await Report.find(query)
        .populate('reporter', 'username')
        .populate('assignedTo', 'username')
        .sort('-createdAt');

      res.json({ reports });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateReport(req, res) {
    try {
      const { id } = req.params;
      const update = req.body;

      const report = await Report.findByIdAndUpdate(
        id,
        { ...update, updatedAt: Date.now() },
        { new: true }
      );

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json({
        message: 'Report updated successfully',
        report
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = reportController;