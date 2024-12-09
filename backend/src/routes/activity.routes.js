// src/routes/activity.routes.js
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const auth = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.post('/',
  auth,
  checkRole(['coordinator', 'admin']),
  activityController.createActivity
);

router.get('/',
  auth,
  activityController.getActivities
);

router.post('/:activityId/join',
  auth,
  activityController.joinActivity
);

router.patch('/:activityId/volunteers/:userId',
  auth,
  checkRole(['coordinator', 'admin']),
  activityController.updateVolunteerStatus
);

module.exports = router;