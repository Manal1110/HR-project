// backend/routes/statisticsHubRoutes.js
const express = require('express');
const router = express.Router();
const statisticsCombuController = require('../controllers/statistics_CombuController');

router.get('/', statisticsCombuController.getStatisticsCombu);
router.post('/', statisticsCombuController.createStatisticsCombu);
router.put('/:id', statisticsCombuController.updateStatisticsCombu);
router.delete('/:id', statisticsCombuController.deleteStatisticsCombu);

module.exports = router;
