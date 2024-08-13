import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ImportEmployees.css'; // Import external CSS for additional styling

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ImportEmployees = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [genderStats, setGenderStats] = useState({ male: 0, female: 0 });
  const [miMdMsStats, setMiMdMsStats] = useState({ MI: 0, MD: 0, MS: 0 });
  const [departmentData, setDepartmentData] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3500/employeeshub/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      fetchStatistics(); // Fetch statistics after successful import
    } catch (error) {
      setMessage('Error importing employees: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:3500/employeeshub');
      const employees = response.data;

      if (employees.length === 0) {
        setMessage('No employee data found.');
        return;
      }

      // Calculate gender statistics
      const maleCount = employees.filter(emp => emp.Sexe === 'M').length;
      const femaleCount = employees.filter(emp => emp.Sexe === 'F').length;
      const totalEmployees = employees.length;

      setGenderStats({
        male: (maleCount / totalEmployees) * 100,
        female: (femaleCount / totalEmployees) * 100,
      });

      // Calculate MI, MD, MS statistics based on 'type CC'
      const miCount = employees.filter(emp => emp['type CC'] === 'MI').length;
      const mdCount = employees.filter(emp => emp['type CC'] === 'MD').length;
      const msCount = employees.filter(emp => emp['type CC'] === 'MS').length;

      setMiMdMsStats({
        MI: (miCount / totalEmployees) * 100,
        MD: (mdCount / totalEmployees) * 100,
        MS: (msCount / totalEmployees) * 100,
      });

      // Calculate department data
      const departments = {};
      employees.forEach(emp => {
        departments[emp.Département] = (departments[emp.Département] || 0) + 1;
      });

      setDepartmentData(Object.entries(departments).map(([department, count]) => ({
        department,
        count,
      })));
    } catch (error) {
      setMessage('Error fetching statistics: ' + error.message);
    }
  };

  useEffect(() => {
    // Fetch statistics on initial render
    fetchStatistics();
  }, []);

  const departmentChartData = {
    labels: departmentData.map(d => d.department),
    datasets: [
      {
        label: 'Employee Count by Department',
        data: departmentData.map(d => d.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const genderHistogramData = {
    labels: ['Males', 'Females'],
    datasets: [
      {
        label: 'Percentage',
        data: [genderStats.male, genderStats.female],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="import-employees">
      <h2>Import Employees</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="file-input"
        />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      
      <button onClick={fetchStatistics} className="refresh-button">Refresh Statistics</button>

      <div className="statistics">
        <div className="gender-stats">
          <h3>Gender Distribution</h3>
          <Bar data={genderHistogramData} options={{
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw.toFixed(2)}%` } }
            },
            scales: {
              x: { beginAtZero: true, title: { display: true, text: 'Gender' } },
              y: { beginAtZero: true, title: { display: true, text: 'Percentage' } }
            }
          }} />
        </div>

        <div className="mi-md-ms-stats">
          <h3>MI, MD, MS Statistics</h3>
          <p>MI: {miMdMsStats.MI.toFixed(2)}%</p>
          <p>MD: {miMdMsStats.MD.toFixed(2)}%</p>
          <p>MS: {miMdMsStats.MS.toFixed(2)}%</p>
        </div>

        <div className="department-chart">
          <h3>Department Distribution</h3>
          <Bar data={departmentChartData} />
        </div>
      </div>
    </div>
  );
};

export default ImportEmployees;
