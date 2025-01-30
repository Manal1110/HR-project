const express = require('express');
const router = express.Router();
const multer = require('multer');
const pointageController = require('../controllers/pointageController');

const upload = multer({ dest: 'uploads/' });

router.route('/')
    .get(pointageController.getAllPointages)
    .post(pointageController.createPointage);

router.route('/:id')
    .get(pointageController.getPointageById)
    .patch(pointageController.updatePointage)
    .delete(pointageController.deletePointage);


router.post('/import', upload.single('file'), pointageController.importPointages);


router.post('/analyze', pointageController.analyzePointages);

module.exports = router;
