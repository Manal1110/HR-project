import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [showForm, setShowForm] = useState(false);
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
        pointage: '',
        profilePic: ''
    });

    const [selectedFields, setSelectedFields] = useState({
        matricule: true,
        name: true,
        firstName: true,
        unite: true,
        department: true,
        kind: true,
        situation: true,
        service: true,
        gender: true,
        cc: true,
        kindCC: true,
        directManager: true,
        manager: true,
        familySituation: true,
        numberOfChildren: true,
        dateOfBirth: true,
        age: true,
        hireDate: true,
        seniority: true,
        fonction: true,
        cin: true,
        category: true,
        level: true,
        speciality: true,
        adresse: true,
        pointage: true,
        profilePic: true
    });

    const [showFilters, setShowFilters] = useState(false);

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
            pointage: '',
            profilePic: ''
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

    const handleFieldSelectionChange = (e) => {
        const { name, checked } = e.target;
        setSelectedFields({
            ...selectedFields,
            [name]: checked
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

    const handleSubmit1 = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3500/employees', formData);
            console.log('Employee created:', response.data);
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error creating employee:', error);
           
        }
    };

    const handleButtonClick = () => {
        setShowForm(true);
    };
    const handleDownloadExcel = () => {
        const fieldsToDownload = Object.keys(selectedFields).filter(field => selectedFields[field]);

        const filteredData = filteredEmployees.map(employee => {
            const filteredEmployee = {};
            fieldsToDownload.forEach(field => {
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
        <div className="max-w-screen overflow-x-hidden mx-auto px-4 py-8 font-playfair">
        
        <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
        <input
            type="text"
            placeholder="Search by Matricule"
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 p-2 border rounded w-full"
        />
        <button
            onClick={() => setShowFilters(!showFilters)}
            className="my-4 mr-4 bg-darkpurple hover:hoverpurple text-white px-4 py-2 rounded"
        >
            Filter
        </button>
        {showFilters && (
            <div className="mb-4 overflow-x-auto whitespace-nowrap p-4 bg-white shadow rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Object.keys(selectedFields).map(field => (
                        <label key={field} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name={field}
                                checked={selectedFields[field]}
                                onChange={handleFieldSelectionChange}
                                className="form-checkbox h-5 w-5 text-indigo-600"
                            />
                            <span className="text-gray-700">{field}</span>
                        </label>
                    ))}
                </div>
            </div>
        )}
        <button onClick={handleDownloadExcel} className="mb-4 bg-darkpurple hover:hoverpurple text-white px-4 py-2 rounded">
            Download Excel
        </button>
        <div>
            {!showForm && (
                <button onClick={handleButtonClick}>Add New Employee</button>
            )}

            {showForm && (
                <form onSubmit={handleSubmit1}>
                    <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} placeholder="Matricule" required />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                    <input type="text" name="unite" value={formData.unite} onChange={handleChange} placeholder="Unite" required />
                    <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" required />
                    <input type="text" name="kind" value={formData.kind} onChange={handleChange} placeholder="Kind" required />
                    <input type="text" name="situation" value={formData.situation} onChange={handleChange} placeholder="Situation" required />
                    <input type="text" name="service" value={formData.service} onChange={handleChange} placeholder="Service" required />
                    <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" required />
                    <input type="text" name="cc" value={formData.cc} onChange={handleChange} placeholder="CC" required />
                    <input type="text" name="kindCC" value={formData.kindCC} onChange={handleChange} placeholder="Kind CC" required />
                    <input type="text" name="directManager" value={formData.directManager} onChange={handleChange} placeholder="Direct Manager" required />
                    <input type="text" name="manager" value={formData.manager} onChange={handleChange} placeholder="Manager" required />
                    <input type="text" name="familySituation" value={formData.familySituation} onChange={handleChange} placeholder="Family Situation" required />
                    <input type="number" name="numberOfChildren" value={formData.numberOfChildren} onChange={handleChange} placeholder="Number of Children" required />
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="Date of Birth" required />
                    <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
                    <input type="date" name="hireDate" value={formData.hireDate} onChange={handleChange} placeholder="Hire Date" required />
                    <input type="text" name="seniority" value={formData.seniority} onChange={handleChange} placeholder="Seniority" required />
                    <input type="text" name="fonction" value={formData.fonction} onChange={handleChange} placeholder="Fonction" required />
                    <input type="text" name="cin" value={formData.cin} onChange={handleChange} placeholder="CIN" required />
                    <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
                    <input type="text" name="level" value={formData.level} onChange={handleChange} placeholder="Level" required />
                    <input type="text" name="speciality" value={formData.speciality} onChange={handleChange} placeholder="Speciality" required />
                    <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adress" required />
                    <input type="text" name="pointage" value={formData.pointage} onChange={handleChange} placeholder="Pointage" required />
                    <input type="text" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Picture Link" required />
                    {/* Add other input fields for each property in your schema */}
                    <button type="submit">Create Employee</button>
                </form>
            )}
        </div>

        
        <div className="table-container max-w-full overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                        <tr className="bg-darkpurple text-white">
                            {selectedFields.profilePic && <th className=" px-12 py-8 whitespace-nowrap">Profile Picture</th>}
                            {selectedFields.matricule && <th className=" px-12 py-8 whitespace-nowrap">Matricule</th>}
                            {selectedFields.name && <th className=" px-12 py-8 whitespace-nowrap">Name</th>}
                            {selectedFields.firstName && <th className=" px-12 py-8 whitespace-nowrap">First Name</th>}
                            {selectedFields.unite && <th className=" px-12 py-8 whitespace-nowrap">Unite</th>}
                            {selectedFields.department && <th className=" px-12 py-4 whitespace-nowrap">Department</th>}
                            {selectedFields.kind && <th className=" px-12 py-4 whitespace-nowrap">Kind</th>}
                            {selectedFields.situation && <th className=" px-12 py-4 whitespace-nowrap">Situation</th>}
                            {selectedFields.service && <th className=" px-12 py-4 whitespace-nowrap">Service</th>}
                            {selectedFields.gender && <th className=" px-12 py-4 whitespace-nowrap">Gender</th>}
                            {selectedFields.cc && <th className=" px-12 py-4 whitespace-nowrap">CC</th>}
                            {selectedFields.kindCC && <th className=" px-12 py-4 whitespace-nowrap">KindCC</th>}
                            {selectedFields.directManager && <th className=" px-12 py-4 whitespace-nowrap">Direct Manager</th>}
                            {selectedFields.manager && <th className=" px-12 py-4 whitespace-nowrap">Manager</th>}
                            {selectedFields.familySituation && <th className=" px-12 py-4 whitespace-nowrap">Family Situation</th>}
                            {selectedFields.numberOfChildren && <th className=" px-12 py-4 whitespace-nowrap">Number of Children</th>}
                            {selectedFields.dateOfBirth && <th className=" px-12 py-4 whitespace-nowrap">Date of Birth</th>}
                            {selectedFields.age && <th className=" px-12 py-4 whitespace-nowrap">Age</th>}
                            {selectedFields.hireDate && <th className=" px-12 py-4 whitespace-nowrap">Hire Date</th>}
                            {selectedFields.seniority && <th className=" px-12 py-4 whitespace-nowrap">Seniority</th>}
                            {selectedFields.fonction && <th className=" px-12 py-4 whitespace-nowrap">Fonction</th>}
                            {selectedFields.cin && <th className=" px-12 py-4 whitespace-nowrap">CIN</th>}
                            {selectedFields.category && <th className=" px-12 py-4 whitespace-nowrap">Category</th>}
                            {selectedFields.level && <th className=" px-12 py-4 whitespace-nowrap">Level</th>}
                            {selectedFields.speciality && <th className=" px-12 py-4 whitespace-nowrap">Speciality</th>}
                            {selectedFields.adresse && <th className=" px-12 py-4 whitespace-nowrap">Adresse</th>}
                            {selectedFields.pointage && <th className=" px-12 py-4 whitespace-nowrap">Pointage</th>}
                            <th className=" px-12 py-4 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr 
                                key={employee._id} 
                                className={`transition-colors duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white hover:bg-midpurple' : 'bg-lightpurple hover:bg-midpurple'}`}
                            >                            {selectedFields.profilePic && (
                                <td className="px-2 py-1 whitespace-nowrap text-center align-middle">
                                    {employee.profilePic && (
                                        <div className="flex justify-center">
                                            <img src={employee.profilePic} alt={`${employee.name}'s profile`} className="h-10 w-10 rounded-full" />
                                        </div>
                                    )}
                                </td>
                            )}
                                {selectedFields.matricule && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.matricule}</td>}
                                {selectedFields.name && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.name}</td>}
                                {selectedFields.firstName && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.firstName}</td>}
                                {selectedFields.unite && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.unite}</td>}
                                {selectedFields.department && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.department}</td>}
                                {selectedFields.kind && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.kind}</td>}
                                {selectedFields.situation && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.situation}</td>}
                                {selectedFields.service && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.service}</td>}
                                {selectedFields.gender && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.gender}</td>}
                                {selectedFields.cc && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.cc}</td>}
                                {selectedFields.kindCC && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.kindCC}</td>}
                                {selectedFields.directManager && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.directManager}</td>}
                                {selectedFields.manager && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.manager}</td>}
                                {selectedFields.familySituation && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.familySituation}</td>}
                                {selectedFields.numberOfChildren && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.numberOfChildren}</td>}
                                {selectedFields.dateOfBirth && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{new Date(employee.dateOfBirth).toLocaleDateString()}</td>}
                                {selectedFields.age && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.age}</td>}
                                {selectedFields.hireDate && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{new Date(employee.hireDate).toLocaleDateString()}</td>}
                                {selectedFields.seniority && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.seniority}</td>}
                                {selectedFields.fonction && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.fonction}</td>}
                                {selectedFields.cin && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.cin}</td>}
                                {selectedFields.category && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.category}</td>}
                                {selectedFields.level && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.level}</td>}
                                {selectedFields.speciality && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.speciality}</td>}
                                {selectedFields.adresse && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.adresse}</td>}
                                {selectedFields.pointage && <td className=" px-2 py-8 whitespace-nowrap text-center align-middle">{employee.pointage}</td>}
                                <td className="px-2 py-8 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditClick(employee)}
                                            className="bg-darkpurple hover:bg-hoverpurple text-white px-2 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {editMode && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="matricule"
                                value={formData.matricule}
                                onChange={handleChange}
                                placeholder="Matricule"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="p-8 border rounded"
                            />
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="unite"
                                value={formData.unite}
                                onChange={handleChange}
                                placeholder="Unite"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="Department"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="kind"
                                value={formData.kind}
                                onChange={handleChange}
                                placeholder="Kind"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="situation"
                                value={formData.situation}
                                onChange={handleChange}
                                placeholder="Situation"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                placeholder="Service"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                placeholder="Gender"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="cc"
                                value={formData.cc}
                                onChange={handleChange}
                                placeholder="CC"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="kindCC"
                                value={formData.kindCC}
                                onChange={handleChange}
                                placeholder="KindCC"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="directManager"
                                value={formData.directManager}
                                onChange={handleChange}
                                placeholder="Direct Manager"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="manager"
                                value={formData.manager}
                                onChange={handleChange}
                                placeholder="Manager"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="familySituation"
                                value={formData.familySituation}
                                onChange={handleChange}
                                placeholder="Family Situation"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="numberOfChildren"
                                value={formData.numberOfChildren}
                                onChange={handleChange}
                                placeholder="Number of Children"
                                className="p-2 border rounded"
                            />
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={new Date(formData.dateOfBirth).toISOString().split('T')[0]}
                                onChange={handleChange}
                                placeholder="Date of Birth"
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Age"
                                className="p-2 border rounded"
                            />
                            <input
                                type="date"
                                name="hireDate"
                                value={new Date(formData.hireDate).toISOString().split('T')[0]}
                                onChange={handleChange}
                                placeholder="Hire Date"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="seniority"
                                value={formData.seniority}
                                onChange={handleChange}
                                placeholder="Seniority"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="fonction"
                                value={formData.fonction}
                                onChange={handleChange}
                                placeholder="Fonction"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="cin"
                                value={formData.cin}
                                onChange={handleChange}
                                placeholder="CIN"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Category"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                placeholder="Level"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="speciality"
                                value={formData.speciality}
                                onChange={handleChange}
                                placeholder="Speciality"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                placeholder="Adresse"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="pointage"
                                value={formData.pointage}
                                onChange={handleChange}
                                placeholder="Pointage"
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="profilePic"
                                value={formData.profilePic}
                                onChange={handleChange}
                                placeholder="Profile Picture URL"
                                className="p-2 border rounded"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                {editMode ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={handleEditCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        </div>



                    </form>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;
