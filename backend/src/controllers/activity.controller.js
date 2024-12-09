// src/controllers/activity.controller.js
const Activity = require('../models/activity.model');
const Notification = require('../models/notification.model');

const activityController = {
  async createActivity(req, res) {
    try {
      const { title, description, location, date, relatedReport } = req.body;

      const activity = new Activity({
        title,
        description,
        location: JSON.parse(location),
        date,
        coordinator: req.user.id,
        relatedReport
      });

      await activity.save();

      res.status(201).json({
        message: 'Activity created successfully',
        activity
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getActivities(req, res) {
    try {
      const { status } = req.query;
      const query = {};

      if (status) query.status = status;

      const activities = await Activity.find(query)
        .populate('coordinator', 'username')
        .populate('volunteers.user', 'username')
        .sort('date');

      res.json({ activities });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

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