import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios or use your custom axios instance

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        roles: [],
        active: false
    });
    const [editMode, setEditMode] = useState(false); // Track edit mode

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:3500/users');
                setUser(response.data[0]); // Assuming there's only one user for simplicity
                setFormData({
                    id: response.data[0]._id,
                    username: response.data[0].username,
                    roles: response.data[0].roles,
                    active: response.data[0].active
                });
            } catch (err) {
                setError(err.message || 'Error fetching user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

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
            const response = await axios.patch('http://localhost:3500/users', formData);
            console.log('User updated:', response.data);
            
            // Fetch updated user data
            const updatedUserResponse = await axios.get('http://localhost:3500/users');
            setUser(updatedUserResponse.data[0]); // Update user state with fresh data
            
            setEditMode(false); // Exit edit mode after successful update
        } catch (err) {
            setError(err.message || 'Error updating user');
        }
    };
    
    const handleEditClick = () => {
        setEditMode(true); // Enable edit mode
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (!user) return <p>No user data available</p>;

    return (
        <div>
            <h1>User Profile</h1>
            <div>
                {editMode ? (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Roles:</label>
                            <input
                                type="text"
                                name="roles"
                                value={formData.roles.join(', ')}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Active:</label>
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            />
                        </div>
                        <button type="submit">Save</button>
                    </form>
                ) : (
                    <div>
                        <p>Username: {user.username}</p>
                        <p>Roles: {user.roles ? user.roles.join(', ') : 'No roles'}</p>
                        <p>Active: {user.active ? 'Yes' : 'No'}</p>
                        <button onClick={handleEditClick}>Edit</button>
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
