const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const { getDashboardStats } = require('../controllers/dashboardController');

router.get('/stats', auth, role('admin'), getDashboardStats);

module.exports = router;