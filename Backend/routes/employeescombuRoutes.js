const express = require('express');
const router = express.Router();
const {
  createEmployeecombu,
  getEmployeescombu,
  getEmployeecombuById,
  updateEmployeecombu,
  deleteEmployeecombu,
  importEmployeescombu,
  getEmployeescombuByMonth,
  deleteEmployeesByMonth
} = require('../controllers/employeescombuController');

// Route to create a new employee
router.post('/', createEmployeecombu);

// Route to get all employees
router.get('/', getEmployeescombu);

// Route to get an employee by ID
router.get('/:id', getEmployeecombuById);

// Route to update an employee
router.put('/:id', updateEmployeecombu);

// Route to delete an employee
router.delete('/:id', deleteEmployeecombu);


router.post('/import', importEmployeescombu);
router.post('/import', importEmployeescombu);
router.get('/month/:month', getEmployeescombuByMonth);
router.delete('/month/:month', deleteEmployeesByMonth); 


module.exports = router;
