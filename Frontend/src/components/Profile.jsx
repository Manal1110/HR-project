import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:3500/users');
                setUser(response.data[0]);
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
            await axios.patch('http://localhost:3500/users', formData);
            const updatedUserResponse = await axios.get('http://localhost:3500/users');
            setUser(updatedUserResponse.data[0]);
            setEditMode(false);
        } catch (err) {
            setError(err.message || 'Error updating user');
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const styles = {
        container: {
            maxWidth: '600px',
            margin: '20px auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        title: {
            textAlign: 'center',
            color: '#333',
        },
        card: {
            marginTop: '20px',
            padding: '15px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
        },
        formGroup: {
            marginBottom: '15px',
        },
        formInput: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        submitButton: {
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        editButton: {
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>No user data available</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>User Profile</h1>
            <div style={styles.card}>
                {editMode ? (
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                style={styles.formInput}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Roles:</label>
                            <input
                                type="text"
                                name="roles"
                                value={formData.roles.join(', ')}
                                onChange={handleChange}
                                style={styles.formInput}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Active:</label>
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            />
                        </div>
                        <button type="submit" style={styles.submitButton}>Save</button>
                    </form>
                ) : (
                    <div className="user-info">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Roles:</strong> {user.roles ? user.roles.join(', ') : 'No roles'}</p>
                        <p><strong>Active:</strong> {user.active ? 'Yes' : 'No'}</p>
                        <button onClick={handleEditClick} style={styles.editButton}>Edit</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
