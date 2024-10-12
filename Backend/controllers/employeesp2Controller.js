const Employeep2 = require('../models/employeesp2');
const multer = require('multer');
const xlsx = require('xlsx'); // For handling Excel files
const path = require('path');
const fs = require('fs');

const createEmployeep2 = async (req, res) => {
  try {
    const newEmployee = new Employeep2(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all employees
const getEmployeesp2 = async (req, res) => {
  try {
    const employees = await Employeep2.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// Get a single employee by ID
const getEmployeep2ById = async (req, res) => {
  try {
    const employee = await Employeep2.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an employee
const updateEmployeep2 = async (req, res) => {
  try {
    const employee = await Employeep2.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an employee
const deleteEmployeep2 = async (req, res) => {
  try {
    const employee = await Employeep2.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Function to import employees from an Excel file
// Update importEmployees function in employeesp2Controller.js
const importEmployeesp2 = async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err.message);
        return res.status(400).json({ message: 'File upload failed: ' + err.message });
      }

      const { month } = req.body; // Get the month from the request body
      if (!month) {
        return res.status(400).json({ message: 'Month is required' });
      }

      const filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetNames = workbook.SheetNames;
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

      // Remove the uploaded file after processing
      fs.unlinkSync(filePath);

      const savedEmployees = [];
      for (const item of data) {
        try {
          const newEmployee = new Employeep2({ ...item, month });
          const savedEmployee = await newEmployee.save();
          savedEmployees.push(savedEmployee);
        } catch (saveError) {
          console.error('Error saving employee:', saveError.message);
        }
      }

      res.status(200).json({
        message: 'Employees imported successfully',
        employees: savedEmployees,
      });
    });
  } catch (error) {
    console.error('Import error:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// Get employees by month
const getEmployeesp2ByMonth = async (req, res) => {
  try {
    const { month } = req.params; // Get the month from the request parameters
    if (!month) {
      return res.status(400).json({ message: 'Month is required' });
    }

    const employees = await Employeep2.find({ month });
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found for the specified month' });
    }

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees by month:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete employees by month
const deleteEmployeesByMonth = async (req, res) => {
  try {
    const { month } = req.params; // Get the month from the request parameters
    if (!month) {
      return res.status(400).json({ message: 'Month is required' });
    }

    const deletedEmployees = await Employeecombu.deleteMany({ month });
    if (deletedEmployees.deletedCount === 0) {
      return res.status(404).json({ message: 'No employees found for the specified month' });
    }

    res.status(200).json({ message: `Employees hired in ${month} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting employees by month:', error.message);
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  createEmployeep2,
  getEmployeesp2,
  getEmployeep2ById,
  updateEmployeep2,
  deleteEmployeep2,
  importEmployeesp2,
  getEmployeesp2ByMonth,
  deleteEmployeesByMonth 
};
