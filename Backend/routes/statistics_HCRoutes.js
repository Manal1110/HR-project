// backend/routes/statisticsHCRoutes.js
const express = require('express');
const router = express.Router();
const statisticsHCController = require('../controllers/statistics_HCController');

router.get('/', statisticsHCController.getStatisticshc);
router.post('/', statisticsHCController.createStatisticshc);
router.put('/:id', statisticsHCController.updateStatisticshc);
router.delete('/:id', statisticsHCController.deleteStatisticshc);

module.exports = router;
