// backend/routes/statisticsP2Routes.js
const express = require('express');
const router = express.Router();
const statisticsP2Controller = require('../controllers/statistics_P_Controller');

router.get('/', statisticsP2Controller.getStatisticsp2);
router.post('/', statisticsP2Controller.createStatisticsp2);
router.put('/:id', statisticsP2Controller.updateStatisticsp2);
router.delete('/:id', statisticsP2Controller.deleteStatisticsp2);

module.exports = router;
