// src/components/Pointage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  const [showForm, setShowForm] = useState(false); // New state for form visibility

  useEffect(() => {
    fetchPointages();
  }, []);

  const fetchPointages = async () => {
    try {
      const response = await axios.get('http://localhost:3500/pointage');
      setPointages(response.data);
    } catch (error) {
      console.error('Error fetching pointages:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.patch(`http://localhost:3500/pointage/${editing}`, form);
      } else {
        await axios.post('http://localhost:3500/pointage', form);
      }
      fetchPointages();
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
      setEditing(null);
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error('Error saving pointage:', error);
    }
  };

  const handleEdit = (pointage) => {
    setForm(pointage);
    setEditing(pointage._id);
    setShowForm(true); // Show the form when editing
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/pointage/${id}`);
      fetchPointages();
    } catch (error) {
      console.error('Error deleting pointage:', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm); // Toggle form visibility
    setEditing(null); // Reset editing state when showing form
  };

  const exportToExcel = () => {
    const filteredData = pointages.map(({ _id, __v, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pointages');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'pointages.xlsx');
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '1200px',
      margin: 'auto',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '20px',
    },
    input: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
    },
    buttonDelete: {
      backgroundColor: '#dc3545',
    },
    buttonEdit: {
      backgroundColor: '#28a745',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f4f4f4',
      border: '1px solid #ddd',
      padding: '8px',
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px',
    },
    tr: {
      textAlign: 'left',
    },
    formContainer: {
      display: showForm ? 'block' : 'none',
    },
  };

  return (
    <div style={styles.container}>
      <h1>Pointage Management</h1>
      <button onClick={toggleForm} style={styles.button}>
        {showForm ? 'Cancel' : 'Add Pointage'}
      </button>

      <button onClick={exportToExcel} style={{ ...styles.button, marginTop: '10px' }}>
        Export to Excel
      </button>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="DATE"
            value={form.DATE}
            onChange={handleChange}
            placeholder="DATE"
            style={styles.input}
          />
          <input
            type="text"
            name="MATRICULE"
            value={form.MATRICULE}
            onChange={handleChange}
            placeholder="MATRICULE"
            style={styles.input}
          />
          <input
            type="text"
            name="NOM"
            value={form.NOM}
            onChange={handleChange}
            placeholder="NOM"
            style={styles.input}
          />
          <input
            type="text"
            name="PRENOM"
            value={form.PRENOM}
            onChange={handleChange}
            placeholder="PRENOM"
            style={styles.input}
          />
          <input
            type="text"
            name="UNITE"
            value={form.UNITE}
            onChange={handleChange}
            placeholder="UNITE"
            style={styles.input}
          />
          <input
            type="text"
            name="TYPE"
            value={form.TYPE}
            onChange={handleChange}
            placeholder="TYPE"
            style={styles.input}
          />
          <input
            type="text"
            name="SERVICE"
            value={form.SERVICE}
            onChange={handleChange}
            placeholder="SERVICE"
            style={styles.input}
          />
          <input
            type="text"
            name="ENTREE"
            value={form.ENTREE}
            onChange={handleChange}
            placeholder="ENTREE"
            style={styles.input}
          />
          <input
            type="text"
            name="SORTIE"
            value={form.SORTIE}
            onChange={handleChange}
            placeholder="SORTIE"
            style={styles.input}
          />
          <input
            type="text"
            name="HN"
            value={form.HN}
            onChange={handleChange}
            placeholder="HN"
            style={styles.input}
          />
          <input
            type="text"
            name="MOTIF"
            value={form.MOTIF}
            onChange={handleChange}
            placeholder="MOTIF"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {editing ? 'Update' : 'Add'} Pointage
          </button>
        </form>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>DATE</th>
            <th style={styles.th}>MATRICULE</th>
            <th style={styles.th}>NOM</th>
            <th style={styles.th}>PRENOM</th>
            <th style={styles.th}>UNITE</th>
            <th style={styles.th}>TYPE</th>
            <th style={styles.th}>SERVICE</th>
            <th style={styles.th}>ENTREE</th>
            <th style={styles.th}>SORTIE</th>
            <th style={styles.th}>HN</th>
            <th style={styles.th}>MOTIF</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pointages.map((pointage) => (
            <tr key={pointage._id} style={styles.tr}>
              <td style={styles.td}>{pointage.DATE}</td>
              <td style={styles.td}>{pointage.MATRICULE}</td>
              <td style={styles.td}>{pointage.NOM}</td>
              <td style={styles.td}>{pointage.PRENOM}</td>
              <td style={styles.td}>{pointage.UNITE}</td>
              <td style={styles.td}>{pointage.TYPE}</td>
              <td style={styles.td}>{pointage.SERVICE}</td>
              <td style={styles.td}>{pointage.ENTREE}</td>
              <td style={styles.td}>{pointage.SORTIE}</td>
              <td style={styles.td}>{pointage.HN}</td>
              <td style={styles.td}>{pointage.MOTIF}</td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(pointage)} style={{ ...styles.button, ...styles.buttonEdit }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(pointage._id)} style={{ ...styles.button, ...styles.buttonDelete }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pointage;
