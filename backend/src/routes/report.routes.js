// src/routes/report.routes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');
const upload = require('../config/multer');

router.post('/', 
  auth, 
  upload.array('photos', 5),
  reportController.createReport
);

router.get('/', 
  auth, 
  reportController.getReports
);

router.patch('/:id',
  auth,
  checkRole(['coordinator', 'admin']),
  reportController.updateReport
);

module.exports = router;