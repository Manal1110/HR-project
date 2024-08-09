import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas';
import './Pointage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
      setEditing(null);
      setShowForm(false);
      setError('');
    } catch (error) {
      setError('Error saving pointage');
      console.error('Error saving pointage:', error);
    }
  };

  const handleEdit = (pointage) => {
    setForm(pointage);
    setEditing(pointage._id);
    setShowForm(true);
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
    setShowForm(!showForm);
    setEditing(null);
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
        motifs: selectedMotifs,
        period: analysisPeriod
      });
  
      const data = response.data;
      const totalsByDate = {};
  
      const startDate = new Date(analysisPeriod.start);
      const endDate = new Date(analysisPeriod.end);
  
      data.forEach(item => {
        const rawDate = item.DATE;
        if (!rawDate) {
          console.warn('Missing DATE field:', item);
          return; // Skip this item if DATE is missing
        }
  
        const date = new Date(rawDate);
        if (isNaN(date.getTime())) {
          console.warn('Invalid DATE value:', rawDate);
          return; // Skip this item if DATE is invalid
        }
  
        const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
  
        if (date >= startDate && date <= endDate) {
          if (!totalsByDate[formattedDate]) {
            totalsByDate[formattedDate] = {};
          }
  
          if (!totalsByDate[formattedDate][item.MOTIF]) {
            totalsByDate[formattedDate][item.MOTIF] = 0;
          }
  
          if (item.MOTIF && selectedMotifs.includes(item.MOTIF)) {
            totalsByDate[formattedDate][item.MOTIF] += 1;
          }
        }
      });
  
      const labels = Object.keys(totalsByDate).sort(); // Dates for x-axis
      const datasets = selectedMotifs.map(motif => ({
        label: motif,
        data: labels.map(date => totalsByDate[date][motif] || 0),
        backgroundColor: getRandomColor(), // Random color for each motif
      }));
  
      setAnalysisData({
        labels,
        datasets
      });
  
      setShowAnalysis(true);
    } catch (error) {
      setError('Error analyzing data');
      console.error('Error analyzing data:', error);
    }
  };
  
  
  // Optional: Function to generate random colors for each dataset
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  
  
  
  
  const exportAnalysisToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      analysisData.labels.map((label, index) => ({
        Period: label,
        Total: analysisData.datasets[0].data[index]
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analysis');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'analysis.xlsx');
  };

  const exportChartAsImage = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then(canvas => {
        const img = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = img;
        link.download = 'chart.png';
        link.click();
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
  data={analysisData}
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
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          autoSkip: true, // Automatically skip labels to avoid overlap
          maxRotation: 45, // Rotate labels for better readability
        }
      },
      y: {
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
          <button onClick={exportChartAsImage} className="exportButton">
            Export Chart as Image
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
