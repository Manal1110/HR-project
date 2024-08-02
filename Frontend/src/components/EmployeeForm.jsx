import React from 'react';

const EmployeeForm = ({ formData, handleChange, handleSubmit, handleSubmit1, handleEditCancel, editMode }) => {
    return (
        <div className="mt-8 font-playfair">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Employee' : 'Create Employee'}</h2>
            <form onSubmit={editMode ? handleSubmit : handleSubmit1} className="space-y-4">
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
                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
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
                        value={formData.hireDate ? new Date(formData.hireDate).toISOString().split('T')[0] : ''}
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
                <div className="flex justify-between space-x-4">
                    {editMode && (
                        <button type="button" onClick={handleEditCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="bg-darkpurple hover:bg-hoverpurple text-white px-12 py-2 rounded ml-auto text-lg">
                        {editMode ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
