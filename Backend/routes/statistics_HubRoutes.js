// backend/routes/statisticsHubRoutes.js
const express = require('express');
const router = express.Router();
const statisticsHubController = require('../controllers/statistics_HubController');

router.get('/', statisticsHubController.getStatisticsHub);
router.post('/', statisticsHubController.createStatisticsHub);
router.put('/:id', statisticsHubController.updateStatisticsHub);
router.delete('/:id', statisticsHubController.deleteStatisticsHub);

module.exports = router;
