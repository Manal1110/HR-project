import React from 'react';

const PointageForm = ({ formData, handleChange, handleSubmit, handleEditCancel, editMode }) => {
    return (
        <div className="mt-8 font-playfair">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Pointage' : 'Add Pointage'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="DATE"
                        value={formData.DATE}
                        onChange={handleChange}
                        placeholder="Date (DD/MM/YYYY)"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="MATRICULE"
                        value={formData.MATRICULE}
                        onChange={handleChange}
                        placeholder="Matricule"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="NOM"
                        value={formData.NOM}
                        onChange={handleChange}
                        placeholder="Name"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="PRENOM"
                        value={formData.PRENOM}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="UNITE"
                        value={formData.UNITE}
                        onChange={handleChange}
                        placeholder="Unite"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="TYPE"
                        value={formData.TYPE}
                        onChange={handleChange}
                        placeholder="Type"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="SERVICE"
                        value={formData.SERVICE}
                        onChange={handleChange}
                        placeholder="Service"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="ENTREE"
                        value={formData.ENTREE}
                        onChange={handleChange}
                        placeholder="Entry Time"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="SORTIE"
                        value={formData.SORTIE}
                        onChange={handleChange}
                        placeholder="Exit Time"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="HN"
                        value={formData.HN}
                        onChange={handleChange}
                        placeholder="HN"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="MOTIF"
                        value={formData.MOTIF}
                        onChange={handleChange}
                        placeholder="Motif"
                        className="p-2 border rounded"
                    />
                </div>
                <div className="flex justify-between space-x-4">
                    {editMode && (
                        <button
                            type="button"
                            onClick={handleEditCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-darkpurple hover:bg-hoverpurple text-white px-12 py-2 rounded ml-auto text-lg"
                    >
                        {editMode ? 'Update' : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PointageForm;
