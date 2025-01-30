import React, { useState } from 'react';

const EmployeeTable = ({ filteredEmployees, selectedFields, handleEditClick, handleDelete }) => {
    const [selectedEmployees, setSelectedEmployees] = useState({});

    const handleSelectEmployee = (id) => {
        setSelectedEmployees((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle the selection
        }));
    };

    const handleSelectAll = (isChecked) => {
        const newSelection = {};
        filteredEmployees.forEach((employee) => {
            newSelection[employee._id] = isChecked; // Set all to checked or unchecked
        });
        setSelectedEmployees(newSelection);
    };

    const handleDeleteSelected = () => {
        const idsToDelete = Object.keys(selectedEmployees).filter((id) => selectedEmployees[id]);
        idsToDelete.forEach((id) => handleDelete(id));
        // Reset selected employees after deletion
        setSelectedEmployees({});
    };

    const isAllSelected = filteredEmployees.length > 0 && 
                          filteredEmployees.every(employee => selectedEmployees[employee._id]);

    return (
        <div className="table-container max-w-full overflow-x-auto overflow-y-auto">
            <button 
                onClick={handleDeleteSelected}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 mb-4 rounded"
            >
                Delete Selected
            </button>
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-darkpurple text-white">
                        <th className="px-2 py-4 whitespace-nowrap">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                        </th>
                        {selectedFields.profilePic && <th className="px-12 py-4 whitespace-nowrap">Profile Picture</th>}
                        {selectedFields.matricule && <th className="px-12 py-4 whitespace-nowrap">Matricule</th>}
                        {selectedFields.name && <th className="px-12 py-4 whitespace-nowrap">Name</th>}
                        {selectedFields.firstName && <th className="px-12 py-4 whitespace-nowrap">First Name</th>}
                        {selectedFields.unite && <th className="px-12 py-4 whitespace-nowrap">Unite</th>}
                        {selectedFields.department && <th className="px-12 py-4 whitespace-nowrap">Department</th>}
                        {selectedFields.kind && <th className="px-12 py-4 whitespace-nowrap">Kind</th>}
                        {selectedFields.situation && <th className="px-12 py-4 whitespace-nowrap">Situation</th>}
                        {selectedFields.service && <th className="px-12 py-4 whitespace-nowrap">Service</th>}
                        {selectedFields.gender && <th className="px-12 py-4 whitespace-nowrap">Gender</th>}
                        {selectedFields.cc && <th className="px-12 py-4 whitespace-nowrap">CC</th>}
                        {selectedFields.kindCC && <th className="px-12 py-4 whitespace-nowrap">KindCC</th>}
                        {selectedFields.directManager && <th className="px-12 py-4 whitespace-nowrap">Direct Manager</th>}
                        {selectedFields.manager && <th className="px-12 py-4 whitespace-nowrap">Manager</th>}
                        {selectedFields.familySituation && <th className="px-12 py-4 whitespace-nowrap">Family Situation</th>}
                        {selectedFields.numberOfChildren && <th className="px-12 py-4 whitespace-nowrap">Number of Children</th>}
                        {selectedFields.dateOfBirth && <th className="px-12 py-4 whitespace-nowrap">Date of Birth</th>}
                        {selectedFields.age && <th className="px-12 py-4 whitespace-nowrap">Age</th>}
                        {selectedFields.hireDate && <th className="px-12 py-4 whitespace-nowrap">Hire Date</th>}
                        {selectedFields.seniority && <th className="px-12 py-4 whitespace-nowrap">Seniority</th>}
                        {selectedFields.fonction && <th className="px-12 py-4 whitespace-nowrap">Fonction</th>}
                        {selectedFields.cin && <th className="px-12 py-4 whitespace-nowrap">CIN</th>}
                        {selectedFields.category && <th className="px-12 py-4 whitespace-nowrap">Category</th>}
                        {selectedFields.level && <th className="px-12 py-4 whitespace-nowrap">Level</th>}
                        {selectedFields.speciality && <th className="px-12 py-4 whitespace-nowrap">Speciality</th>}
                        {selectedFields.adresse && <th className="px-12 py-4 whitespace-nowrap">Adresse</th>}
                        {selectedFields.pointage && <th className="px-12 py-4 whitespace-nowrap">Pointage</th>}
                        <th className="px-12 py-4 whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee, index) => (
                        <tr
                            key={employee._id}
                            className={`transition-colors duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white hover:bg-midpurple' : 'bg-lightpurple hover:bg-midpurple'}`}
                        >
                            <td className="px-2 py-8 whitespace-nowrap text-center align-middle">
                                <input
                                    type="checkbox"
                                    checked={!!selectedEmployees[employee._id]}
                                    onChange={() => handleSelectEmployee(employee._id)}
                                />
                            </td>
                            {selectedFields.profilePic && (
                                <td className="px-2 py-1 whitespace-nowrap text-center align-middle">
                                    {employee.profilePic && (
                                        <div className="flex justify-center">
                                            <img src={employee.profilePic} alt={`${employee.name}'s profile`} className="h-10 w-10 rounded-full" />
                                        </div>
                                    )}
                                </td>
                            )}
                            {selectedFields.matricule && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.matricule}</td>}
                            {selectedFields.name && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.name}</td>}
                            {selectedFields.firstName && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.firstName}</td>}
                            {selectedFields.unite && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.unite}</td>}
                            {selectedFields.department && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.department}</td>}
                            {selectedFields.kind && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.kind}</td>}
                            {selectedFields.situation && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.situation}</td>}
                            {selectedFields.service && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.service}</td>}
                            {selectedFields.gender && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.gender}</td>}
                            {selectedFields.cc && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.cc}</td>}
                            {selectedFields.kindCC && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.kindCC}</td>}
                            {selectedFields.directManager && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.directManager}</td>}
                            {selectedFields.manager && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.manager}</td>}
                            {selectedFields.familySituation && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.familySituation}</td>}
                            {selectedFields.numberOfChildren && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.numberOfChildren}</td>}
                            {selectedFields.dateOfBirth && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{new Date(employee.dateOfBirth).toLocaleDateString()}</td>}
                            {selectedFields.age && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.age}</td>}
                            {selectedFields.hireDate && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{new Date(employee.hireDate).toLocaleDateString()}</td>}
                            {selectedFields.seniority && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.seniority}</td>}
                            {selectedFields.fonction && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.fonction}</td>}
                            {selectedFields.cin && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.cin}</td>}
                            {selectedFields.category && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.category}</td>}
                            {selectedFields.level && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.level}</td>}
                            {selectedFields.speciality && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.speciality}</td>}
                            {selectedFields.adresse && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.adresse}</td>}
                            {selectedFields.pointage && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{employee.pointage}</td>}
                            <td className="px-2 py-8 whitespace-nowrap text-center align-middle">
                                <button
                                    onClick={() => handleEditClick(employee)}
                                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-1 rounded"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTable;
