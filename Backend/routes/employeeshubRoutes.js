const express = require('express');
const router = express.Router();
const {
  createEmployeehub,
  getEmployeeshub,
  getEmployeehubById,
  updateEmployeehub,
  deleteEmployeehub,
  importEmployeeshub,
  getEmployeeshubByMonth,
  deleteEmployeesByMonth
} = require('../controllers/employeeshubController');

// Route to create a new employee
router.post('/', createEmployeehub);

// Route to get all employees
router.get('/', getEmployeeshub);

// Route to get an employee by ID
router.get('/:id', getEmployeehubById);

// Route to update an employee
router.put('/:id', updateEmployeehub);

// Route to delete an employee
router.delete('/:id', deleteEmployeehub);


router.post('/import', importEmployeeshub);
router.get('/month/:month', getEmployeeshubByMonth);
router.delete('/month/:month', deleteEmployeesByMonth); 

module.exports = router;
