import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

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
        <div className="max-w-screen overflow-x-hidden mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
            <input
                type="text"
                placeholder="Search by Matricule"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4 p-2 border rounded w-full"
            />
            <div className="mb-4 overflow-x-auto whitespace-nowrap">
                {Object.keys(selectedFields).map(field => (
                    <label key={field} className="inline-block mr-4">
                        <input
                            type="checkbox"
                            name={field}
                            checked={selectedFields[field]}
                            onChange={handleFieldSelectionChange}
                            className="mr-2"
                        />
                        {field}
                    </label>
                ))}
            </div>
            <button onClick={handleDownloadExcel} className="mb-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Download Excel
            </button>
            <div className="table-container max-w-full overflow-x-auto">
                <table className="min-w-full border-collapse border">
                    <thead>
                        <tr>
                            {selectedFields.profilePic && <th className="border px-4 py-2">Profile Picture</th>}
                            {selectedFields.matricule && <th className="border px-4 py-2">Matricule</th>}
                            {selectedFields.name && <th className="border px-4 py-2">Name</th>}
                            {selectedFields.firstName && <th className="border px-4 py-2">First Name</th>}
                            {selectedFields.unite && <th className="border px-4 py-2">Unite</th>}
                            {selectedFields.department && <th className="border px-4 py-2">Department</th>}
                            {selectedFields.kind && <th className="border px-4 py-2">Kind</th>}
                            {selectedFields.situation && <th className="border px-4 py-2">Situation</th>}
                            {selectedFields.service && <th className="border px-4 py-2">Service</th>}
                            {selectedFields.gender && <th className="border px-4 py-2">Gender</th>}
                            {selectedFields.cc && <th className="border px-4 py-2">CC</th>}
                            {selectedFields.kindCC && <th className="border px-4 py-2">KindCC</th>}
                            {selectedFields.directManager && <th className="border px-4 py-2">Direct Manager</th>}
                            {selectedFields.manager && <th className="border px-4 py-2">Manager</th>}
                            {selectedFields.familySituation && <th className="border px-4 py-2">Family Situation</th>}
                            {selectedFields.numberOfChildren && <th className="border px-4 py-2">Number of Children</th>}
                            {selectedFields.dateOfBirth && <th className="border px-4 py-2">Date of Birth</th>}
                            {selectedFields.age && <th className="border px-4 py-2">Age</th>}
                            {selectedFields.hireDate && <th className="border px-4 py-2">Hire Date</th>}
                            {selectedFields.seniority && <th className="border px-4 py-2">Seniority</th>}
                            {selectedFields.fonction && <th className="border px-4 py-2">Fonction</th>}
                            {selectedFields.cin && <th className="border px-4 py-2">CIN</th>}
                            {selectedFields.category && <th className="border px-4 py-2">Category</th>}
                            {selectedFields.level && <th className="border px-4 py-2">Level</th>}
                            {selectedFields.speciality && <th className="border px-4 py-2">Speciality</th>}
                            {selectedFields.adresse && <th className="border px-4 py-2">Adresse</th>}
                            {selectedFields.pointage && <th className="border px-4 py-2">Pointage</th>}
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(employee => (
                            <tr key={employee._id}>
                                {selectedFields.profilePic && (
                                    <td className="border px-4 py-2">
                                        {employee.profilePic && (
                                            <img src={employee.profilePic} alt={`${employee.name}'s profile`} className="h-10 w-10 rounded-full" />
                                        )}
                                    </td>
                                )}
                                {selectedFields.matricule && <td className="border px-4 py-2">{employee.matricule}</td>}
                                {selectedFields.name && <td className="border px-4 py-2">{employee.name}</td>}
                                {selectedFields.firstName && <td className="border px-4 py-2">{employee.firstName}</td>}
                                {selectedFields.unite && <td className="border px-4 py-2">{employee.unite}</td>}
                                {selectedFields.department && <td className="border px-4 py-2">{employee.department}</td>}
                                {selectedFields.kind && <td className="border px-4 py-2">{employee.kind}</td>}
                                {selectedFields.situation && <td className="border px-4 py-2">{employee.situation}</td>}
                                {selectedFields.service && <td className="border px-4 py-2">{employee.service}</td>}
                                {selectedFields.gender && <td className="border px-4 py-2">{employee.gender}</td>}
                                {selectedFields.cc && <td className="border px-4 py-2">{employee.cc}</td>}
                                {selectedFields.kindCC && <td className="border px-4 py-2">{employee.kindCC}</td>}
                                {selectedFields.directManager && <td className="border px-4 py-2">{employee.directManager}</td>}
                                {selectedFields.manager && <td className="border px-4 py-2">{employee.manager}</td>}
                                {selectedFields.familySituation && <td className="border px-4 py-2">{employee.familySituation}</td>}
                                {selectedFields.numberOfChildren && <td className="border px-4 py-2">{employee.numberOfChildren}</td>}
                                {selectedFields.dateOfBirth && <td className="border px-4 py-2">{new Date(employee.dateOfBirth).toLocaleDateString()}</td>}
                                {selectedFields.age && <td className="border px-4 py-2">{employee.age}</td>}
                                {selectedFields.hireDate && <td className="border px-4 py-2">{new Date(employee.hireDate).toLocaleDateString()}</td>}
                                {selectedFields.seniority && <td className="border px-4 py-2">{employee.seniority}</td>}
                                {selectedFields.fonction && <td className="border px-4 py-2">{employee.fonction}</td>}
                                {selectedFields.cin && <td className="border px-4 py-2">{employee.cin}</td>}
                                {selectedFields.category && <td className="border px-4 py-2">{employee.category}</td>}
                                {selectedFields.level && <td className="border px-4 py-2">{employee.level}</td>}
                                {selectedFields.speciality && <td className="border px-4 py-2">{employee.speciality}</td>}
                                {selectedFields.adresse && <td className="border px-4 py-2">{employee.adresse}</td>}
                                {selectedFields.pointage && <td className="border px-4 py-2">{employee.pointage}</td>}
                                <td className="border px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleEditClick(employee)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(employee._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
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
                                className="p-2 border rounded"
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