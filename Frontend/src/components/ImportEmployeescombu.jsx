import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ImportEmployees.css'; // Import external CSS for additional styling

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ImportEmployeescombu = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [genderStats, setGenderStats] = useState({ male: 0, female: 0 });
  const [miMdMsStats, setMiMdMsStats] = useState({ MI: 0, MD: 0, MS: 0 });
  const [departmentData, setDepartmentData] = useState([]);
  const [statisticsData, setStatisticsData] = useState([]);
  const [newStat, setNewStat] = useState({ year: '', month: '', absenteeism: '', overtime: '', turnover: '' });
  const [editStat, setEditStat] = useState(null);
  const [serviceData, setServiceData] = useState([]); // State for service data

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
      const response = await axios.post('http://localhost:3500/employeescombu/import', formData, {
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
      // Fetch employee data
      const employeesResponse = await axios.get('http://localhost:3500/employeescombu');
      const employees = employeesResponse.data;

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


      // Calculate service data
      const services = {};
      employees.forEach(emp => {
        services[emp.Service] = (services[emp.Service] || 0) + 1;
      });

      setServiceData(Object.entries(services).map(([service, count]) => ({
        service,
        count,
      })));

      // Fetch statistics data
      const statisticsResponse = await axios.get('http://localhost:3500/statisticsCombu');
      const statistics = statisticsResponse.data;

      if (statistics.length === 0) {
        setMessage('No statistics data found.');
        return;
      }

      setStatisticsData(statistics);

    } catch (error) {
      setMessage('Error fetching statistics: ' + error.message);
    }
  };

  const handleAddStat = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3500/statisticsCombu', newStat);
      setMessage('Statistics added successfully.');
      setNewStat({ year: '', month: '', absenteeism: '', overtime: '', turnover: '' });
      fetchStatistics(); // Refresh statistics data
    } catch (error) {
      setMessage('Error adding statistics: ' + error.message);
    }
  };

  const handleUpdateStat = async (event) => {
    event.preventDefault();
    try {
      if (!editStat) return;
      await axios.put(`http://localhost:3500/statisticsCombu/${editStat._id}`, editStat);
      setMessage('Statistics updated successfully.');
      setEditStat(null);
      fetchStatistics(); // Refresh statistics data
    } catch (error) {
      setMessage('Error updating statistics: ' + error.message);
    }
  };

  const handleEditClick = (stat) => {
    setEditStat(stat);
    setNewStat(stat); // Populate form fields with current stat data for editing
  };

  useEffect(() => {
    fetchStatistics(); // Fetch statistics on initial render
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

  const serviceChartData = {
    labels: serviceData.map(d => d.service),
    datasets: [
      {
        label: 'Employee Count by Service',
        data: serviceData.map(d => d.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
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
          <Bar data={departmentChartData} options={{
            plugins: {
              legend: { display: true },
              tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } }
            },
            scales: {
              x: { beginAtZero: true, title: { display: true, text: 'Department' } },
              y: { beginAtZero: true, title: { display: true, text: 'Employee Count' } }
            }
          }} />
        </div>

        <div className="service-stats">
          <h3>Service Distribution</h3>
          <Bar data={serviceChartData} options={{
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } }
            },
            scales: {
              x: { beginAtZero: true, title: { display: true, text: 'Service' } },
              y: { beginAtZero: true, title: { display: true, text: 'Employee Count' } }
            }
          }} />
        </div>
        
        <div className="statistics-data">
          <h3>Statistics Overview</h3>
          <form onSubmit={editStat ? handleUpdateStat : handleAddStat} className="stats-form">
            <input
              type="number"
              placeholder="Year"
              value={editStat ? editStat.year : newStat.year}
              onChange={(e) => (editStat ? setEditStat({ ...editStat, year: e.target.value }) : setNewStat({ ...newStat, year: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Month"
              value={editStat ? editStat.month : newStat.month}
              onChange={(e) => (editStat ? setEditStat({ ...editStat, month: e.target.value }) : setNewStat({ ...newStat, month: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Absenteeism"
              value={editStat ? editStat.absenteeism : newStat.absenteeism}
              onChange={(e) => (editStat ? setEditStat({ ...editStat, absenteeism: e.target.value }) : setNewStat({ ...newStat, absenteeism: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Overtime"
              value={editStat ? editStat.overtime : newStat.overtime}
              onChange={(e) => (editStat ? setEditStat({ ...editStat, overtime: e.target.value }) : setNewStat({ ...newStat, overtime: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Turnover"
              value={editStat ? editStat.turnover : newStat.turnover}
              onChange={(e) => (editStat ? setEditStat({ ...editStat, turnover: e.target.value }) : setNewStat({ ...newStat, turnover: e.target.value }))}
            />
            <button type="submit" className="submit-button">
              {editStat ? 'Update Statistics' : 'Add Statistics'}
            </button>
          </form>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Month</th>
                <th>Absenteeism</th>
                <th>Overtime</th>
                <th>Turnover</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {statisticsData.map((stat) => (
                <tr key={stat._id}>
                  <td>{stat.year}</td>
                  <td>{stat.month}</td>
                  <td>{stat.absenteeism}</td>
                  <td>{stat.overtime}</td>
                  <td>{stat.turnover}</td>
                  <td>
                    <button onClick={() => handleEditClick(stat)} className="edit-button">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImportEmployeescombu;
