const Employee = require('../models/Employee');

// Create a new employee
exports.createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an employee by ID
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Import employees from Excel
exports.importEmployees = async (req, res) => {
    try {
        const { employees } = req.body;
        await Employee.insertMany(employees);
        res.status(201).json({ message: 'Employees imported successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getGenderStatistics = async (req, res) => {
    try {
        // Count the number of employees by gender
        const maleCount = await Employee.countDocuments({ gender: 'Male' });
        const femaleCount = await Employee.countDocuments({ gender: 'Female' });
        const otherCount = await Employee.countDocuments({ gender: { $nin: ['Male', 'Female'] } });

        // Prepare the response
        const stats = {
            maleCount,
            femaleCount,
            otherCount
        };

        res.json(stats);
    } catch (err) {
        console.error('Error in getGenderStatistics:', err);
        res.status(500).json({ error: 'An error occurred while fetching gender statistics.' });
    }
};
