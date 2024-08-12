import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import HashLoader from 'react-spinners/HashLoader';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';
import FilterSection from './FilterSection';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
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
        openModal();
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
        closeModal();
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

    const handleImportExcel = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            importEmployees(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const importEmployees = async (employees) => {
        try {
            await axios.post('http://localhost:3500/employees/import', { employees });
            fetchEmployees();
        } catch (err) {
            setError(err.message || 'Error importing employees');
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

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <HashLoader size={100} color={"#123abc"} />
            </div>
        );
    }

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

            <div className="flex justify-between items-center mb-4">
                <div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-darkpurple hover:bg-hoverpurple text-white px-4 py-2 rounded mr-4"
                    >
                        Filter
                    </button>
                    <button onClick={handleDownloadExcel} className="bg-darkpurple hover:bg-hoverpurple text-white px-4 py-2 rounded">
                        Download Excel
                    </button>
                    <button onClick={openModal} className="bg-darkpurple hover:bg-hoverpurple text-white px-4 py-2 rounded mx-4">
                        Add New Employee
                    </button>
                    
                </div>
                <div>
                    <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleImportExcel}
                            className="bg-darkpurple hover:bg-hoverpurple text-white px-4 py-2 rounded mx-4"
                        />
                        
                </div>
            </div>

            {showFilters && (
                <FilterSection
                    selectedFields={selectedFields}
                    handleFieldSelectionChange={handleFieldSelectionChange}
                />
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Add/Edit Employee"
                className="fixed inset-0 flex items-center justify-center z-50 outline-none focus:outline-none transition-transform transform-gpu ease-in-out duration-300"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            >
                <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto space-y-6 animate-slideDown my-12">
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 mt-8 mr-8 text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <EmployeeForm
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit1={handleSubmit1}
                        handleEditCancel={handleEditCancel}
                        editMode={editMode}
                    />
                </div>
            </Modal>


            <EmployeeTable
                filteredEmployees={filteredEmployees}
                selectedFields={selectedFields}
                handleEditClick={handleEditClick}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default EmployeeManagement;
