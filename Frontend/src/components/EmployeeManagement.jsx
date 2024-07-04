import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './EmployeeManagement.css'; // Import your CSS file for styling

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        matricule: '',
        name: '',
        firstName: '',
        unite: '',
        department: '',
        kind: '',
        situation: '',
        service: '',
        gender: '',
        cc: '',
        kindCC: '',
        directManager: '',
        manager: '',
        familySituation: '',
        numberOfChildren: 0,
        dateOfBirth: '',
        age: 0,
        hireDate: '',
        seniority: '',
        fonction: '',
        cin: '',
        category: '',
        level: '',
        speciality: '',
        adresse: '',
        pointage: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        setFilteredEmployees(
            employees.filter(employee =>
                employee.matricule.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, employees]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3500/employees');
            setEmployees(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Error fetching employees');
            setLoading(false);
        }
    };

    const handleEditClick = (employee) => {
        setFormData(employee);
        setEditMode(true);
    };

    const handleEditCancel = () => {
        setEditMode(false);
        setFormData({
            matricule: '',
            name: '',
            firstName: '',
            unite: '',
            department: '',
            kind: '',
            situation: '',
            service: '',
            gender: '',
            cc: '',
            kindCC: '',
            directManager: '',
            manager: '',
            familySituation: '',
            numberOfChildren: 0,
            dateOfBirth: '',
            age: 0,
            hireDate: '',
            seniority: '',
            fonction: '',
            cin: '',
            category: '',
            level: '',
            speciality: '',
            adresse: '',
            pointage: ''
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3500/employees/${id}`);
            fetchEmployees();
        } catch (err) {
            setError(err.message || 'Error deleting employee');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.patch(`http://localhost:3500/employees/${formData._id}`, formData);
            } else {
                await axios.post('http://localhost:3500/employees', formData);
            }
            fetchEmployees();
            handleEditCancel();
        } catch (err) {
            setError(err.message || 'Error updating or creating employee');
        }
    };

    const handleDownloadExcel = () => {
        const selectedFields = ['matricule', 'name', 'firstName', 'unite', 'department', 'kind', 'situation', 'service', 'gender', 'cc', 'kindCC', 'directManager', 'manager', 'familySituation', 'numberOfChildren', 'dateOfBirth', 'age', 'hireDate', 'seniority', 'fonction', 'cin', 'category', 'level', 'speciality', 'adresse', 'pointage'];
        
        const filteredData = filteredEmployees.map(employee => {
            const filteredEmployee = {};
            selectedFields.forEach(field => {
                filteredEmployee[field] = employee[field];
            });
            return filteredEmployee;
        });

        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Employees');
        XLSX.writeFile(wb, 'employees.xlsx');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Employee Management</h1>
            <input
                type="text"
                placeholder="Search by Matricule"
                value={searchTerm}
                onChange={handleSearch}
            />
            <button onClick={handleDownloadExcel}>Download Excel</button>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Matricule</th>
                        <th>Name</th>
                        <th>First Name</th>
                        <th>Unite</th>
                        <th>Department</th>
                        <th>Kind</th>
                        <th>Situation</th>
                        <th>Service</th>
                        <th>Gender</th>
                        <th>CC</th>
                        <th>KindCC</th>
                        <th>Direct Manager</th>
                        <th>Manager</th>
                        <th>Family Situation</th>
                        <th>Number of Children</th>
                        <th>Date of Birth</th>
                        <th>Age</th>
                        <th>Hire Date</th>
                        <th>Seniority</th>
                        <th>Fonction</th>
                        <th>CIN</th>
                        <th>Category</th>
                        <th>Level</th>
                        <th>Speciality</th>
                        <th>Adresse</th>
                        <th>Pointage</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map(employee => (
                        <tr key={employee._id}>
                            <td>{employee.matricule}</td>
                            <td>{employee.name}</td>
                            <td>{employee.firstName}</td>
                            <td>{employee.unite}</td>
                            <td>{employee.department}</td>
                            <td>{employee.kind}</td>
                            <td>{employee.situation}</td>
                            <td>{employee.service}</td>
                            <td>{employee.gender}</td>
                            <td>{employee.cc}</td>
                            <td>{employee.kindCC}</td>
                            <td>{employee.directManager}</td>
                            <td>{employee.manager}</td>
                            <td>{employee.familySituation}</td>
                            <td>{employee.numberOfChildren}</td>
                            <td>{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
                            <td>{employee.age}</td>
                            <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
                            <td>{employee.seniority}</td>
                            <td>{employee.fonction}</td>
                            <td>{employee.cin}</td>
                            <td>{employee.category}</td>
                            <td>{employee.level}</td>
                            <td>{employee.speciality}</td>
                            <td>{employee.adresse}</td>
                            <td>{employee.pointage}</td>
                            <td>
                                <button onClick={() => handleEditClick(employee)}>Edit</button>
                                <button onClick={() => handleDelete(employee._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editMode && (
                <div className="edit-form">
                    <h2>Edit Employee</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="matricule"
                            value={formData.matricule}
                            onChange={handleChange}
                            placeholder="Matricule"
                        />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                        />
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                        />
                        <input
                            type="text"
                            name="unite"
                            value={formData.unite}
                            onChange={handleChange}
                            placeholder="Unite"
                        />
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Department"
                        />
                        <input
                            type="text"
                            name="kind"
                            value={formData.kind}
                            onChange={handleChange}
                            placeholder="Kind"
                        />
                        <input
                            type="text"
                            name="situation"
                            value={formData.situation}
                            onChange={handleChange}
                            placeholder="Situation"
                        />
                          <input
                            type="text"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            placeholder="Service"
                        />

                        <input
                            type="text"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            placeholder="Gender"
                        />
                        <input
                            type="text"
                            name="cc"
                            value={formData.cc}
                            onChange={handleChange}
                            placeholder="CC"
                        />
                        <input
                            type="text"
                            name="kindCC"
                            value={formData.kindCC}
                            onChange={handleChange}
                            placeholder="KindCC"
                        />
                        <input
                            type="text"
                            name="directManager"
                            value={formData.directManager}
                            onChange={handleChange}
                            placeholder="Direct Manager"
                        />
                        <input
                            type="text"
                            name="manager"
                            value={formData.manager}
                            onChange={handleChange}
                            placeholder="Manager"
                        />
                        <input
                            type="text"
                            name="familySituation"
                            value={formData.familySituation}
                            onChange={handleChange}
                            placeholder="Family Situation"
                        />
                        <input
                            type="number"
                            name="numberOfChildren"
                            value={formData.numberOfChildren}
                            onChange={handleChange}
                            placeholder="Number of Children"
                        />
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={new Date(formData.dateOfBirth).toISOString().split('T')[0]}
                            onChange={handleChange}
                            placeholder="Date of Birth"
                        />
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Age"
                        />
                        <input
                            type="date"
                            name="hireDate"
                            value={new Date(formData.hireDate).toISOString().split('T')[0]}
                            onChange={handleChange}
                            placeholder="Hire Date"
                        />
                        <input
                            type="text"
                            name="seniority"
                            value={formData.seniority}
                            onChange={handleChange}
                            placeholder="Seniority"
                        />
                        <input
                            type="text"
                            name="fonction"
                            value={formData.fonction}
                            onChange={handleChange}
                            placeholder="Fonction"
                        />
                        <input
                            type="text"
                            name="cin"
                            value={formData.cin}
                            onChange={handleChange}
                            placeholder="CIN"
                        />
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Category"
                        />
                        <input
                            type="text"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            placeholder="Level"
                        />
                        <input
                            type="text"
                            name="speciality"
                            value={formData.speciality}
                            onChange={handleChange}
                            placeholder="Speciality"
                        />
                        <input
                            type="text"
                            name="adresse"
                            value={formData.adresse}
                            onChange={handleChange}
                            placeholder="Adresse"
                        />
                        <input
                            type="text"
                            name="pointage"
                            value={formData.pointage}
                            onChange={handleChange}
                            placeholder="Pointage"
                        />
                        <button type="submit">{editMode ? 'Update' : 'Create'}</button>
                        <button type="button" onClick={handleEditCancel}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;
