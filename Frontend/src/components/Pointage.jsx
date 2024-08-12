import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Modal from 'react-modal';
import HashLoader from 'react-spinners/HashLoader';
import PointageForm from './PointageForm'; // Updated import
import PointageTable from './PointageTable'; // Import the PointageTable component

// Set the root element for accessibility
Modal.setAppElement('#root');

const Pointage = () => {
    const [pointages, setPointages] = useState([]);
    const [form, setForm] = useState({
        DATE: '',
        MATRICULE: '',
        NOM: '',
        PRENOM: '',
        UNITE: '',
        TYPE: '',
        SERVICE: '',
        ENTREE: '',
        SORTIE: '',
        HN: '',
        MOTIF: ''
    });
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [selectedFields, setSelectedFields] = useState({
        DATE: true,
        MATRICULE: true,
        NOM: true,
        PRENOM: true,
        UNITE: true,
        TYPE: true,
        SERVICE: true,
        ENTREE: true,
        SORTIE: true,
        HN: true,
        MOTIF: true
    });
    const [showChoices, setShowChoices] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchPointages();
    }, [refreshKey]);

    const fetchPointages = async () => {
        try {
            const response = await axios.get('http://localhost:3500/pointage');
            setPointages(response.data);
        } catch (error) {
            setError('Error fetching pointages');
            console.error('Error fetching pointages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedDate = form.DATE.split('/').reverse().join('-'); // Convert DD/MM/YYYY to YYYY-MM-DD
            const data = { ...form, DATE: formattedDate };
            if (editing) {
                await axios.patch(`http://localhost:3500/pointage/${editing}`, data);
            } else {
                await axios.post('http://localhost:3500/pointage', data);
            }
            fetchPointages();
            handleCloseModal();
        } catch (error) {
            setError('Error saving pointage');
            console.error('Error saving pointage:', error);
        }
    };

    const handleEdit = (pointage) => {
        setForm(pointage);
        setEditing(pointage._id);
        openModal();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3500/pointage/${id}`);
            fetchPointages();
        } catch (error) {
            console.error('Error deleting pointage:', error);
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setEditing(null);
        setForm({
            DATE: '',
            MATRICULE: '',
            NOM: '',
            PRENOM: '',
            UNITE: '',
            TYPE: '',
            SERVICE: '',
            ENTREE: '',
            SORTIE: '',
            HN: '',
            MOTIF: ''
        });
    };

    const handleFieldChange = (e) => {
        setSelectedFields({ ...selectedFields, [e.target.name]: e.target.checked });
    };

    const exportToExcel = () => {
        const filteredData = pointages.map((pointage) =>
            Object.keys(pointage).reduce((acc, key) => {
                if (selectedFields[key] && key !== '_id' && key !== '__v') {
                    acc[key] = pointage[key];
                }
                return acc;
            }, {})
        );
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Pointages');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'pointages.xlsx');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        try {
            await axios.post('http://localhost:3500/pointage/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            setError('Error importing pointages');
            console.error('Error importing pointages:', error);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <HashLoader size={100} color={"#123abc"} />
            </div>
        );
    }

    return (
        <div className="max-w-screen overflow-x-hidden mx-auto px-4 py-8 font-playfair">
            <h1 className="text-2xl font-bold mb-4">Pointage Management</h1>
            <div className="flex items-center space-x-4 mb-4">
                <button
                    onClick={openModal}
                    className="bg-darkpurple hover:bg-hoverpurple text-white px-4 py-2 rounded"
                >
                    {editing ? 'Cancel' : 'Add Pointage'}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowChoices(!showChoices)}
                        className="bg-darkpurple hover:bg-hoverpurple text-white px-4 py-2 rounded"
                    >
                        {showChoices ? 'Hide Export Options' : 'Show Export Options'}
                    </button>
                    {showChoices && (
                        <div className="absolute bg-white border border-gray-200 p-4 mt-2 shadow-lg rounded">
                            {Object.keys(selectedFields).map((field) => (
                                <div key={field}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name={field}
                                            checked={selectedFields[field]}
                                            onChange={handleFieldChange}
                                        />
                                        {field}
                                    </label>
                                </div>
                            ))}
                            <button
                                onClick={exportToExcel}
                                className="bg-darkpurple hover:bg-hoverpurple text-white px-4 py-2 rounded"
                            >
                                Export to Excel
                            </button>
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    onChange={handleFileUpload}
                    className="bg-darkpurple hover:bg-hoverpurple text-white px-4 py-2 rounded"
                />
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error messages */}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Pointage Modal"
                className="fixed inset-0 bg-white p-8 shadow-lg rounded"
            >
                <PointageForm
                    formData={form}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    handleEditCancel={handleCloseModal}
                    editMode={!!editing}
                />
            </Modal>

            <PointageTable
                filteredPointages={pointages}
                selectedFields={selectedFields}
                handleEditClick={handleEdit}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default Pointage;
