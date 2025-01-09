// src/controllers/activity.controller.js
const Activity = require('../models/activity.model');
const Notification = require('../models/notification.model');

const activityController = {
  async createActivity(req, res) {
    try {
      const { title, description, location, date, relatedReport } = req.body;
  
      // Validasi input
      if (!title || !description || !location || !date || !relatedReport) {
        return res.status(400).json({ error: 'Semua field harus diisi' });
      }
  
      // Buat aktivitas baru
      const activity = new Activity({
        title,
        description,
        location: typeof location === 'string' ? JSON.parse(location) : location,
        date: new Date(date),
        coordinator: req.user.id, // Ambil dari user yang terautentikasi
        relatedReport,
        status: 'planned', // Set status default
        volunteers: [] // Inisialisasi array volunteers kosong
      });
  
      const savedActivity = await activity.save();
  
      // Populate data coordinator
      await savedActivity.populate('coordinator', 'username');
  
      res.status(201).json({
        success: true,
        message: 'Activity created successfully',
        activity: savedActivity
      });
  
    } catch (error) {
      console.error('Create activity error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Gagal membuat aktivitas'
      });
    }
  },
  
  async getActivities(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set ke awal hari
  
      const activities = await Activity.find({
        status: { $ne: 'cancelled' },
        date: { $gte: today }
      })
      .populate('coordinator', 'username')
      .populate('volunteers.user', 'username')
      .populate('relatedReport', 'title description') // Tambahkan populate untuk report
      .sort({ date: 1 });
  
      // Transform data sebelum dikirim
      const transformedActivities = activities.map(activity => ({
        _id: activity._id,
        title: activity.title,
        description: activity.description,
        location: activity.location,
        date: activity.date,
        coordinator: activity.coordinator?.username || 'Koordinator tidak tersedia',
        volunteers: activity.volunteers || [],
        totalVolunteers: activity.volunteers?.filter(v => v.status === 'approved').length || 0,
        status: activity.status,
        relatedReport: activity.relatedReport
      }));
  
      res.json({
        success: true,
        activities: transformedActivities
      });
  
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Gagal mengambil data aktivitas'
      });
    }
  }, // Tambahkan koma di sini
  
  async joinActivity(req, res) {
    try {
      const { activityId } = req.params;
  
      const activity = await Activity.findById(activityId);
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
  
      const alreadyJoined = activity.volunteers.some(
        v => v.user.toString() === req.user.id
      );
  
      if (alreadyJoined) {
        return res.status(400).json({
          error: 'You have already joined this activity'
        });
      }
  
      activity.volunteers.push({
        user: req.user.id,
        status: 'pending'
      });
  
      await activity.save();
  
      // Create notification for coordinator
      await Notification.create({
        recipient: activity.coordinator,
        type: 'activity',
        title: 'New Volunteer Request',
        message: `${req.user.username} wants to join ${activity.title}`,
        relatedId: activity._id,
        onModel: 'Activity'
      });
  
      res.json({
        message: 'Join request sent successfully',
        activity
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async updateVolunteerStatus(req, res) {
    try {
      const { activityId, userId } = req.params;
      const { status } = req.body;

      const activity = await Activity.findById(activityId);
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      // Check if user is coordinator
      if (activity.coordinator.toString() !== req.user.id) {
        return res.status(403).json({
          error: 'Only coordinator can update volunteer status'
        });
      }

      const volunteerIndex = activity.volunteers.findIndex(
        v => v.user.toString() === userId
      );

      if (volunteerIndex === -1) {
        return res.status(404).json({ error: 'Volunteer not found' });
      }

      activity.volunteers[volunteerIndex].status = status;
      await activity.save();

      // Create notification for volunteer
      await Notification.create({
        recipient: userId,
        type: 'activity',
        title: 'Volunteer Status Updated',
        message: `Your request to join ${activity.title} has been ${status}`,
        relatedId: activity._id,
        onModel: 'Activity'
      });

      res.json({
        message: 'Volunteer status updated successfully',
        activity
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = activityController;
