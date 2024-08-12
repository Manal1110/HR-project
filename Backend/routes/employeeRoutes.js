const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');

router.route('/')
    .get(employeesController.getEmployees)
    .post(employeesController.createEmployee);

router.route('/:id')
    .get(employeesController.getEmployeeById)
    .patch(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);



router.post('/import', employeesController.importEmployees);




module.exports = router;
