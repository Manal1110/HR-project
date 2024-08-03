// routes/pointage.js
const express = require('express');
const router = express.Router();
const pointageController = require('../controllers/pointageController');

router.route('/')
    .get(pointageController.getAllPointages)
    .post(pointageController.createPointage);

router.route('/:id')
    .get(pointageController.getPointageById)
    .patch(pointageController.updatePointage)
    .delete(pointageController.deletePointage);

module.exports = router;
