const Report = require('../models/report.model');
const Notification = require('../models/notification.model');

const reportController = {
  // Membuat laporan baru
  async createReport(req, res) {
    try {
      const { title, description, category, location } = req.body;
      const photos = req.files ? req.files.map(file => file.path) : [];

      if (!title || !description || !category || !location) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const report = new Report({
        title,
        description,
        category,
        location: JSON.parse(location),
        photos,
        reporter: req.user.id,
        status: 'draft',
      });

      await report.save();

      res.status(201).json({
        message: 'Report created successfully',
        report,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create report' });
    }
  },

  // Mendapatkan daftar laporan
  async getReports(req, res) {
    try {
      const { status, category, verifiedDate } = req.query;
      console.log(req.query); // Tambahkan log untuk debugging
      const query = {};
  
      if (status) {
        const statuses = status.split(',');
        const validStatuses = ['draft', 'verified', 'active'];
  
        if (!statuses.every((stat) => validStatuses.includes(stat))) {
          return res.status(400).json({ error: 'Invalid status filter' });
        }
  
        query.status = { $in: statuses };
      }
  
      if (category) {
        query.category = category;
      }
  
      if (verifiedDate) {
        query.verifiedDate = { $gte: new Date(verifiedDate) };
      }
  
      const reports = await Report.find(query)
        .populate('reporter', 'username email')
        .populate('assignedTo', 'username')
        .sort('-createdAt');
  
      res.status(200).json({ reports });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  }, // <- Tambahkan penutup kurung kurawal ini untuk getReports

  // Memperbarui laporan
  async updateReport(req, res) {
    try {
      const { id } = req.params;
      const { status, verifiedDate, assignedTo, ...rest } = req.body;

      const validStatuses = ['draft', 'verified', 'active'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      if (status === 'verified' && !verifiedDate) {
        return res.status(400).json({ error: 'Verified date is required for verified status' });
      }

      const update = {
        ...rest,
        updatedAt: Date.now(), // Tambahkan updatedAt otomatis
      };

      if (status) {
        update.status = status;
      }

      if (status === 'verified') {
        update.verifiedDate = verifiedDate;
      }

      if (assignedTo) {
        update.assignedTo = assignedTo;
      }

      const report = await Report.findByIdAndUpdate(id, update, { new: true });

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.status(200).json({
        message: 'Report updated successfully',
        report,
      });
    } catch (error) {
      console.error('Error in updateReport:', error);
      res.status(500).json({ error: 'Failed to update report' });
    }
  },

  // Mendapatkan laporan berdasarkan ID
  async getReportById(req, res) {
    try {
      const { id } = req.params;

      const report = await Report.findById(id)
        .populate('reporter', 'username email')
        .populate('assignedTo', 'username');

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.status(200).json({ report });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch report details' });
    }
  },
};

module.exports = reportController;