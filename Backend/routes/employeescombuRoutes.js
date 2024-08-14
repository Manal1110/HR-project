const express = require('express');
const router = express.Router();
const {
  createEmployeecombu,
  getEmployeescombu,
  getEmployeecombuById,
  updateEmployeecombu,
  deleteEmployeecombu,
  importEmployeescombu
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

module.exports = router;
