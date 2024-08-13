import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { Bar, Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import './Pointage.css';
import ExcelJS from 'exceljs';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement 
);

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
  const [selectedMotifs, setSelectedMotifs] = useState([]);
  const [analysisPeriod, setAnalysisPeriod] = useState({ start: '', end: '' });
  const [analysisData, setAnalysisData] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const chartRef = useRef(null);


  useEffect(() => {
    fetchPointages();
  }, [refreshKey]);

  const fetchPointages = async () => {
    try {
      const response = await axios.get('http://localhost:3500/pointage');
      console.log('Fetched pointages data:', response.data);
      setPointages(response.data);
    } catch (error) {
      setError('Error fetching pointages');
      console.error('Error fetching pointages:', error);
    }
  };
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = form.DATE.split('/').reverse().join('-');
      const data = {
        ...form,
        DATE: formattedDate,
        ENTREE: form.ENTREE,
        SORTIE: form.SORTIE,
      };

      if (editing) {
        await axios.patch(`http://localhost:3500/pointage/${editing}`, data);
      } else {
        await axios.post('http://localhost:3500/pointage', data);
      }

      fetchPointages();
      setRefreshKey(prevKey => prevKey + 1);
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

  };

  const handlePeriodChange = (e) => {
    const { name, value } = e.target;
    setAnalysisPeriod(prev => ({ ...prev, [name]: value }));
  };

  const handleMotifChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMotifs(prev =>
      checked ? [...prev, value] : prev.filter(motif => motif !== value)
    );
  };

  const analyzeData = async () => {
    try {
      const response = await axios.post('http://localhost:3500/pointage/analyze', {
        start: analysisPeriod.start,
        end: analysisPeriod.end,
        motifs: selectedMotifs
      });

      const data = response.data;
      console.log('Received Data:', data);

      setAnalysisData(data);
      setShowAnalysis(true);
    } catch (error) {
      setError('Error analyzing data');
      console.error('Error analyzing data:', error);
    }

    console.log('Selected Motifs:', selectedMotifs);
  };
  
  
  const exportAnalysisToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(analysisData.datasets[0].data.map((value, index) => ({
      Date: analysisData.labels[index],
      Total: value
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analysis');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'analysis.xlsx');
  };
  const colors = [
    'rgba(255, 99, 132, 0.2)', // Red
    'rgba(54, 162, 235, 0.2)', // Blue
    'rgba(255, 206, 86, 0.2)', // Yellow
    'rgba(75, 192, 192, 0.2)', // Green
    'rgba(153, 102, 255, 0.2)', // Purple
    'rgba(255, 159, 64, 0.2)', // Orange
    'rgba(199, 199, 199, 0.2)', // Light Gray
    'rgba(83, 102, 255, 0.2)', // Dark Blue
    'rgba(255, 0, 255, 0.2)', // Magenta
    'rgba(0, 255, 255, 0.2)', // Cyan
    'rgba(128, 0, 128, 0.2)', // Purple
    'rgba(0, 128, 128, 0.2)', // Teal
    'rgba(255, 165, 0, 0.2)'  // Orange
  ];

  

  const downloadChart = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current.canvas.parentNode).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'chart.png';
        link.click();
      }).catch((error) => {
        console.error('Error downloading chart:', error);
      });
    }
  };
 
  

  return (
    <div className="container">
      <h1>Pointage Management</h1>
      <button onClick={toggleForm} className="button">
        {showForm ? 'Close Form' : 'Add New Pointage'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="DATE"
            value={form.DATE}
            onChange={handleChange}
            placeholder="Date (dd/mm/yyyy)"
            className="input"
            required
          />
          {/* Add other input fields here */}
          <button type="submit" className="button">
            {editing ? 'Update Pointage' : 'Add Pointage'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
      <button onClick={exportToExcel} className="button">
        Export to Excel
      </button>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={() => setShowChoices(!showChoices)} className="button">
        {showChoices ? 'Hide Choices' : 'Show Choices'}
      </button>
      {showChoices && (
        <div>
          {Object.keys(selectedFields).map((field) => (
            <label key={field}>
              <input
                type="checkbox"
                name={field}
                checked={selectedFields[field]}
                onChange={handleFieldChange}
              />
              {field}
            </label>
          ))}
        </div>
      )}
      <h2>Analysis</h2>
      <input
        type="date"
        name="start"
        value={analysisPeriod.start}
        onChange={handlePeriodChange}
        placeholder="Start Date"
      />
      <input
        type="date"
        name="end"
        value={analysisPeriod.end}
        onChange={handlePeriodChange}
        placeholder="End Date"
      />
      <select name="type" onChange={(e) => setAnalysisPeriod(prev => ({ ...prev, type: e.target.value }))}>
        <option value="day">Daily</option>
        <option value="week">Weekly</option>
        <option value="month">Monthly</option>
      </select>
      <div>
        {['CM', 'MAT', 'AUT', 'Récupération', 'CT', 'MIS', 'AT', 'ABSI', 'CG', 'CSS', 'FOR', 'MAR', '0'].map(motif => (
          <label key={motif}>
            <input
              type="checkbox"
              value={motif}
              checked={selectedMotifs.includes(motif)}
              onChange={handleMotifChange}
            />
            {motif}
          </label>
        ))}
      </div>
      <button onClick={analyzeData} className="button">
        Analyze Data
      </button>
     
      {showAnalysis && (
        <div className="chartContainer">


<Bar
  data={{
    labels: analysisData.labels,
    datasets: analysisData.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace('0.2', '1'), // Adjust border color to be fully opaque
      borderWidth: 1,
    })),
  }}
  ref={chartRef}
  options={{
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Total'
        }
      }
    }
  }}
/>


          <button onClick={exportAnalysisToExcel} className="exportButton">
            Export Analysis to Excel
          </button>
          <button onClick={downloadChart} className="button">
            Download Chart
          </button>
        </div>
      
)}


      {pointages.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(pointages[0]).map((key) => (
                selectedFields[key] && key !== '_id' && key !== '__v' && <th key={key}>{key}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pointages.map((pointage) => (
              <tr key={pointage._id}>
                {Object.keys(pointage).map((key) => (
                  selectedFields[key] && key !== '_id' && key !== '__v' && <td key={key}>{pointage[key]}</td>
                ))}
                <td>
                  <button onClick={() => handleEdit(pointage)} className="button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(pointage._id)} className="buttonDanger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

};

export default Pointage;
