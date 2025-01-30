import React from 'react';

const FilterSection = ({ selectedFields, handleFieldSelectionChange }) => {
    return (
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
    );
};

export default FilterSection;
