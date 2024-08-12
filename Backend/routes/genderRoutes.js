const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');


// Add logging in your route handler
router.get('/gender-stats', employeesController.getGenderStatistics);


module.exports = router;
