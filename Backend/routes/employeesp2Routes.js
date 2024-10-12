const express = require('express');
const router = express.Router();
const {
  createEmployeep2,
  getEmployeesp2,
  getEmployeep2ById,
  updateEmployeep2,
  deleteEmployeep2,
  importEmployeesp2,
  getEmployeesp2ByMonth,
  deleteEmployeesByMonth
} = require('../controllers/employeesp2Controller');

// Route to create a new employee
router.post('/', createEmployeep2);

// Route to get all employees
router.get('/', getEmployeesp2);

// Route to get an employee by ID
router.get('/:id', getEmployeep2ById);

// Route to update an employee
router.put('/:id', updateEmployeep2);

// Route to delete an employee
router.delete('/:id', deleteEmployeep2);


router.post('/import', importEmployeesp2);

router.post('/import', importEmployeesp2);
router.get('/month/:month', getEmployeesp2ByMonth);
router.delete('/month/:month', deleteEmployeesByMonth); 
module.exports = router;
