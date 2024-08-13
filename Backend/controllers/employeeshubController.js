const Employeehub = require('../models/employeeshub');
const multer = require('multer');
const xlsx = require('xlsx'); // For handling Excel files
const path = require('path');
const fs = require('fs');

const createEmployeehub = async (req, res) => {
  try {
    const newEmployee = new Employeehub(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all employees
const getEmployeeshub = async (req, res) => {
  try {
    const employees = await Employeehub.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// Get a single employee by ID
const getEmployeehubById = async (req, res) => {
  try {
    const employee = await Employeehub.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an employee
const updateEmployeehub = async (req, res) => {
  try {
    const employee = await Employeehub.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an employee
const deleteEmployeehub = async (req, res) => {
  try {
    const employee = await Employeehub.findByIdAndDelete(req.params.id);
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
// Update importEmployees function in employeeshubController.js
const importEmployeeshub = async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err.message);
        return res.status(400).json({ message: 'File upload failed: ' + err.message });
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
          const newEmployee = new Employeehub(item);
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



module.exports = {
  createEmployeehub,
  getEmployeeshub,
  getEmployeehubById,
  updateEmployeehub,
  deleteEmployeehub,
  importEmployeeshub
};
