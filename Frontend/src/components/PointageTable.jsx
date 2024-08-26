import React from 'react';

const PointageTable = ({ filteredPointages, selectedFields, handleEditClick, handleDelete }) => {
    return (
        <div className="table-container max-w-full overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-darkpurple text-white">
                        {selectedFields.DATE && <th className="px-12 py-8 whitespace-nowrap">Date</th>}
                        {selectedFields.MATRICULE && <th className="px-12 py-8 whitespace-nowrap">Matricule</th>}
                        {selectedFields.NOM && <th className="px-12 py-8 whitespace-nowrap">Name</th>}
                        {selectedFields.PRENOM && <th className="px-12 py-8 whitespace-nowrap">First Name</th>}
                        {selectedFields.UNITE && <th className="px-12 py-8 whitespace-nowrap">Unite</th>}
                        {selectedFields.TYPE && <th className="px-12 py-8 whitespace-nowrap">Type</th>}
                        {selectedFields.SERVICE && <th className="px-12 py-8 whitespace-nowrap">Service</th>}
                        {selectedFields.ENTREE && <th className="px-12 py-8 whitespace-nowrap">Entry</th>}
                        {selectedFields.SORTIE && <th className="px-12 py-8 whitespace-nowrap">Exit</th>}
                        {selectedFields.HN && <th className="px-12 py-8 whitespace-nowrap">HN</th>}
                        {selectedFields.MOTIF && <th className="px-12 py-8 whitespace-nowrap">Motif</th>}
                        <th className="px-12 py-4 whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPointages.map((pointage, index) => (
                        <tr
                            key={pointage._id}
                            className={`transition-colors duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white hover:bg-midpurple' : 'bg-lightpurple hover:bg-midpurple'}`}
                        >
                            {selectedFields.DATE && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{formatDate(pointage.DATE)}</td>}
                            {selectedFields.MATRICULE && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.MATRICULE}</td>}
                            {selectedFields.NOM && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.NOM}</td>}
                            {selectedFields.PRENOM && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.PRENOM}</td>}
                            {selectedFields.UNITE && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.UNITE}</td>}
                            {selectedFields.TYPE && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.TYPE}</td>}
                            {selectedFields.SERVICE && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.SERVICE}</td>}
                            {selectedFields.ENTREE && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.ENTREE}</td>}
                            {selectedFields.SORTIE && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.SORTIE}</td>}
                            {selectedFields.HN && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.HN}</td>}
                            {selectedFields.MOTIF && <td className="px-2 py-8 whitespace-nowrap text-center align-middle">{pointage.MOTIF}</td>}
                            <td className="px-2 py-8 whitespace-nowrap">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditClick(pointage)}
                                        className="bg-darkpurple hover:bg-hoverpurple text-white px-2 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pointage._id)}
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
    );
};

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

export default PointageTable;
