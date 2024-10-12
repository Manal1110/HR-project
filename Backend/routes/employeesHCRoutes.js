const express = require('express');
const router = express.Router();
const {
  createEmployeehc,
  getEmployeeshc,
  getEmployeehcById,
  updateEmployeehc,
  deleteEmployeehc,
  importEmployeeshc,
  getEmployeeshcByMonth,
  deleteEmployeesByMonth
} = require('../controllers/employeeshcController');

// Route to create a new employee
router.post('/', createEmployeehc);

// Route to get all employees
router.get('/', getEmployeeshc);

// Route to get an employee by ID
router.get('/:id', getEmployeehcById);

// Route to update an employee
router.put('/:id', updateEmployeehc);

// Route to delete an employee
router.delete('/:id', deleteEmployeehc);


router.post('/import', importEmployeeshc);

router.get('/month/:month', getEmployeeshcByMonth);
router.delete('/month/:month', deleteEmployeesByMonth); 


module.exports = router;
