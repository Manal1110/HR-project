import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './ImportEmployees.css'; // Import external CSS for additional styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale, faFemale } from '@fortawesome/free-solid-svg-icons';


ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ImportEmployeeshc = () => {
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
  const [month, setMonth] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [enteredMonth, setEnteredMonth] = useState(''); // State for entered month
  const [absenteeismData, setAbsenteeismData] = useState({ absenteeism: 0, turnover: 0, overtime: 0 });
  const [monthData, setMonthData] = useState({});
  const [uniteData, setUniteData] = useState([]); 

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleEnteredMonthChange = (e) => {
    setEnteredMonth(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    if (!month) {
      setMessage('Please select a month.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('month', month);


    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3500/employeesp2/import', formData, {
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

  const fetchStatistics = async (selectedMonth = enteredMonth) => {
    const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in YYYY-MM format
    const monthToFetch = selectedMonth || currentMonth;
    const formattedMonth = monthToFetch.split('-').reverse().join('-');

    try {
      const employeesResponse = await axios.get(`http://localhost:3500/employeesp2/month/${monthToFetch}`);
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

      
      // Calculate unite data
      const unites = {};
      employees.forEach(emp => {
        unites[emp.Unité] = (unites[emp.Unité] || 0) + 1;
      });

      setUniteData(Object.entries(unites).map(([unite, count]) => ({
        unite,
        count,
      })));

      // Fetch statistics data
      const statisticsResponse = await axios.get('http://localhost:3500/statisticsp2');
      const statistics = statisticsResponse.data;

      if (statistics.length === 0) {
        setMessage('No statistics data found.');
        return;
      }

      setStatisticsData(statistics);
      const monthContributions = {};

      statistics.forEach(stat => {
        const { absenteeism, turnover, overtime, month } = stat;

        if (!monthContributions[month]) {
          monthContributions[month] = { absenteeism: 0, turnover: 0, overtime: 0 };
        }

        monthContributions[month].absenteeism += absenteeism;
        monthContributions[month].turnover += turnover;
        monthContributions[month].overtime += overtime;
      });

      setMonthData(monthContributions);


    } catch (error) {
      setMessage('Error fetching statistics: ' + error.message);
    }
  };


  const getStackedBarData = () => {
    const months = Object.keys(monthData);
  
    // Map month numbers to month names
    const monthLabels = months.map(month => {
      const monthIndex = parseInt(month, 10) - 1; // Convert month number to zero-based index
      return monthNames[monthIndex] || 'Unknown'; // Default to 'Unknown' if out of range
    });
  
    // Prepare datasets for each month
    const datasets = months.map((month, index) => {
      return {
        label: monthLabels[index],
        data: [
          monthData[month].absenteeism,
          monthData[month].turnover,
          monthData[month].overtime
        ],
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        borderWidth: 1,
      };
    });
  
    return {
      labels: ['Absenteeism', 'Turnover', 'Overtime'], // Metrics on x-axis
      datasets: datasets
    };
  };
  
  const stackedBarChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)}`
        }
      }
    },
    scales: {
      x: { 
        stacked: true, 
        title: { display: true, text: 'Metrics' },
      },
      y: { 
        stacked: true, 
        title: { display: true, text: 'Total Value' }, 
        beginAtZero: true 
      }
    }
  };

  const handleAddStat = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3500/statisticsp2', newStat);
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
      await axios.put(`http://localhost:3500/statisticsp2/${editStat._id}`, editStat);
      setMessage('Statistics updated successfully.');
      setEditStat(null);
      fetchStatistics(); // Refresh statistics data
    } catch (error) {
      setMessage('Error updating statistics: ' + error.message);
    }
  };

  const handleDeleteStat = async (id) => {
    try {
      await axios.delete(`http://localhost:3500/statisticsp2/${id}`);
      setMessage('Statistics deleted successfully.');
      fetchStatistics(); // Refresh statistics data after deletion
    } catch (error) {
      setMessage('Error deleting statistics: ' + error.message);
    }
  };
  const handleEditClick = (stat) => {
    setEditStat(stat);
    setNewStat(stat); // Populate form fields with current stat data for editing
  };
  useEffect(() => {
    fetchStatistics(); // Fetch statistics on initial render
  }, []);

  const handleFetchStatistics = () => {
    fetchStatistics(enteredMonth);
  };

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

  const genderPieData = {
    labels: ['Males', 'Females'],
    datasets: [
      {
        label: 'Percentage',
        data: [genderStats.male, genderStats.female],
        backgroundColor: [
          'rgb(119, 118, 179)', // Sophisticated dark blue
          'rgb(235, 211, 248)' // Elegant peach
        ],
        borderColor: [
          'rgb(90, 99, 156)',  // Dark grey for border
          'rgb(226, 187, 233)' // Darker peach for border
        ],
        borderWidth: 2,
        hoverOffset: 6,  // Slightly lift the segment on hover
        hoverBackgroundColor: [
          'rgb(90, 99, 156)', // Darker blue for hover effect
          'rgb(226, 187, 233)' // Daring peach for hover effect
        ],
      },
    ],
  };
  

  const miMdMsPieData = {
    labels: ['MI', 'MD', 'MS'],
    datasets: [
      {
        label: 'Percentage',
        data: [miMdMsStats.MI, miMdMsStats.MD, miMdMsStats.MS],
        backgroundColor: [
          'rgb(90, 99, 156)',  // Soft blue
          'rgb(155, 134, 189)',  // Light teal
          'rgb(247, 239, 229)'    // Soft orange
        ],
        borderColor: [
          'rgb(90, 99, 156)',  // Soft blue
          'rgb(155, 134, 189)',  // Light teal
          'rgb(247, 239, 229)'   // Soft orange     // Darker orange for contrast
        ],
        borderWidth: 2,
        hoverOffset: 8,  // Slightly lift the segment on hover
        hoverBackgroundColor: [
          'rgb(90, 99, 156)',  // Soft blue
          'rgb(155, 134, 189)',  // Light teal
          'rgb(226, 187, 233)'   // Soft orange       // Darker orange for hover effect
        ],
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
  const uniteChartData = {
    labels: uniteData.map(d => d.unite),
    datasets: [
      {
        label: 'Employee Count by Unite',
        data: uniteData.map(d => d.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };


   
  
    const totalIcons = 10; // Number of icons to represent 100%
    const maleIcons = Math.round((genderStats.male / 100) * totalIcons);
    const femaleIcons = totalIcons - maleIcons;

      // Format the month and year, default to current month if none is selected
  const formatMonthYear = (monthStr) => {
    const [year, month] = monthStr ? monthStr.split('-') : [new Date().getFullYear(), (new Date().getMonth() + 1).toString().padStart(2, '0')];
    return `Month: ${month}, Year: ${year}`;
  };

  const [deleteMonth, setDeleteMonth] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  
  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteMessage('');
  
    try {
      const response = await axios.delete(`http://localhost:3500/employeesp2/month/${deleteMonth}`);
      setDeleteMessage(response.data.message); // Set success message
      setDeleteMonth(''); // Clear input after successful delete
    } catch (error) {
      setDeleteMessage(error.response ? error.response.data.message : 'Error deleting employees'); // Set error message
    }
  };
  

  
  return (

  
    <div className="max-w-screen overflow-x-hidden px-4 pt-4 bg-gray-100 font-playfair">
      <div className='bg-gray-50 p-6 mb-6 rounded-lg border-2	border-darkpurple shadow-lg '>
      <h2 className="text-center text-2xl font-bold mb-5 text-darkpurple">Dashboard: Analysis of the Total Headcount</h2>
      <form onSubmit={handleSubmit} className="form flex justify-between mb-6">
        <div className="flex items-center justify-between">
          <div>
          <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="file-input border border-gray-300 rounded-lg p-2  bg-darkpurple text-white"
            />
            <input type="month" value={month} onChange={handleMonthChange} required className="month-input" />

            <button
              type="submit"
              disabled={loading}
              className={`submit-button px-16 py-2 rounded-lg text-white ml-6 ${
                loading ? 'bg-darkpurple cursor-not-allowed' : 'bg-darkpurple hover:bg-blue-700'
              }`}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {message && <p className="message">{message}</p>}


                {/* Display selected month and year */}
      <div className="month-year-display">
        <p>{`Selected Month: ${formatMonthYear(month)}`}</p>
        <p>{`Entered Month: ${formatMonthYear(enteredMonth)}`}</p>
      </div>
      

      <input
        type="month"
        value={enteredMonth}
        onChange={handleEnteredMonthChange}
        className="month-input"
      />


          <div className='mr-6'>
            <button
              onClick={handleFetchStatistics}
              className="refresh-button px-4 py-2 bg-darkpurple text-white rounded-lg hover:bg-purple-700 justify-end"
            >
              Refresh Statistics
            </button>
          </div>
    
           
        </div>
        
      </form>
      {message && <p className="message text-red-600 text-center mb-4">{message}</p>}

                                      {/* New Section for Deleting Employees */}
                                      <h2 className="text-center text-2xl font-bold mb-5 text-darkpurple">Delete Employees by Month</h2>
      <form onSubmit={handleDelete} className="form mb-6 flex justify-center">
        <div className="flex items-center">
          <input
            type="month"
            value={deleteMonth}
            onChange={(e) => setDeleteMonth(e.target.value)} // Assuming you have a state setDeleteMonth
            required
            className="month-input border border-gray-300 rounded-lg p-2"
          />
          <button
            type="submit"
            className="delete-button px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-4"
          >
            Delete Employees
          </button>
        </div>
      </form>
      {deleteMessage && <p className="message text-red-600 text-center mb-4">{deleteMessage}</p>} {/* For success/error message */}

  
      </div>
      
      
  
      <div className="statistics grid grid-cols-1 md:grid-cols-3 gap-6 ">
      <div className="gender-stats p-6 rounded-lg shadow-2xl border-2 border-darkpurple bg-white flex flex-col justify-center items-center">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 drop-shadow-md">
        Gender Distribution
      </h3>
      <div className="flex justify-center items-center space-x-2 flex-grow">
        {/* Male Icons */}
        {[...Array(maleIcons)].map((_, index) => (
          <FontAwesomeIcon
            key={`male-${index}`}
            icon={faMale}
            className="text-iconb text-5xl transform scale-y-150 "
          />
        ))}
        {/* Female Icons */}
        {[...Array(femaleIcons)].map((_, index) => (
          <FontAwesomeIcon
            key={`female-${index}`}
            icon={faFemale}
            className="text-iconf text-5xl scale-y-150"
          />
        ))}
      </div>
      <div className="mt-4 text-gray-700 text-center">
        <p>{genderStats.male}% Males</p>
        <p>{genderStats.female}% Females</p>
      </div>
    </div>
    
    
        <div className="department-chart bg-gray-50 p-6 rounded-lg shadow-lg border-2	border-darkpurple">
          <h3 className="text-lg font-semibold mb-4 pt-4">Department Distribution</h3>
          <Bar
            data={departmentChartData}
            options={{
              plugins: {
                legend: { display: true },
                tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } },
              },
              scales: {
                x: { beginAtZero: true, title: { display: true, text: 'Department' } },
                y: { beginAtZero: true, title: { display: true, text: 'Employee Count' } },

              },
            }}
          />
        </div>

        <div className="mi-md-ms-stats p-6 rounded-lg shadow-2xl border-2 border-darkpurple bg-gray-50">
      <h3 className="text-2xl font-bold mb-6 text-center text-darkpurple drop-shadow-md">
        MI, MD, MS Statistics
      </h3>
      <div className="flex justify-center"> {/* Center the chart */}
        <div className="w-3/4 h-3/4"> {/* Adjust the width and height as needed */}
          <Pie
            data={miMdMsPieData}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    color: '#333',  // Dark grey for text
                    font: { size: 16, weight: 'bold' },
                    padding: 20,
                  },
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Dark tooltip background
                  titleFont: { size: 14, weight: 'bold', color: '#FFF' }, // White title text
                  bodyFont: { size: 14, color: '#EEE' }, // Light grey body text
                  callbacks: {
                    label: (context) =>
                      `${context.label}: ${context.raw.toFixed(2)}%`,
                  },
                },

              },
            }}
          />
        </div>
      </div>
    </div>
    
  
        <div className="service-stats bg-gray-50 p-6 rounded-lg shadow-lg border-2	border-darkpurple mb-4">
          <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
          <Bar
            data={serviceChartData}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } },
              },
              scales: {
                x: { beginAtZero: true, title: { display: true, text: 'Service' } },
                y: { beginAtZero: true, title: { display: true, text: 'Employee Count' } },
              },
            }}
          />

<h3 className="text-lg font-semibold mb-4">Unite Distribution</h3>
          <Bar
            data={uniteChartData}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } },
              },
              scales: {
                x: { beginAtZero: true, title: { display: true, text: 'Unite' } },
                y: { beginAtZero: true, title: { display: true, text: 'Employee Count' } },
              },
            }}
          />
        </div>

  
        <div className="statistics-data bg-gray-50 p-6 rounded-lg shadow-lg border-2	border-darkpurple col-span-1 md:col-span-2 mb-4">
          <h3 className="text-lg font-semibold mb-4">Statistics Overview</h3>
          <form
            onSubmit={editStat ? handleUpdateStat : handleAddStat}
            className="stats-form grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
          >
            <input
              type="number"
              placeholder="Year"
              value={editStat ? editStat.year : newStat.year}
              onChange={(e) =>
                editStat
                  ? setEditStat({ ...editStat, year: e.target.value })
                  : setNewStat({ ...newStat, year: e.target.value })
              }
              className="border border-darkpurple rounded-lg p-2"
            />
            <input
              type="number"
              placeholder="Month"
              value={editStat ? editStat.month : newStat.month}
              onChange={(e) =>
                editStat
                  ? setEditStat({ ...editStat, month: e.target.value })
                  : setNewStat({ ...newStat, month: e.target.value })
              }
              className="border border-darkpurple rounded-lg p-2"
            />
            <input
              type="number"
              placeholder="Absenteeism"
              value={editStat ? editStat.absenteeism : newStat.absenteeism}
              onChange={(e) =>
                editStat
                  ? setEditStat({ ...editStat, absenteeism: e.target.value })
                  : setNewStat({ ...newStat, absenteeism: e.target.value })
              }
              className="border border-darkpurple rounded-lg p-2"
            />
            <input
              type="number"
              placeholder="Overtime"
              value={editStat ? editStat.overtime : newStat.overtime}
              onChange={(e) =>
                editStat
                  ? setEditStat({ ...editStat, overtime: e.target.value })
                  : setNewStat({ ...newStat, overtime: e.target.value })
              }
              className="border border-darkpurple rounded-lg p-2"
            />
            <input
              type="number"
              placeholder="Turnover"
              value={editStat ? editStat.turnover : newStat.turnover}
              onChange={(e) =>
                editStat
                  ? setEditStat({ ...editStat, turnover: e.target.value })
                  : setNewStat({ ...newStat, turnover: e.target.value })
              }
              className="border border-darkpurple rounded-lg p-2"
            />
            <button
              type="submit"
              className="submit-button col-span-2 md:col-span-3 bg-darkpurple text-white rounded-lg p-2 hover:bg-blue-700"
            >
              {editStat ? 'Update Statistics' : 'Add Statistics'}
            </button>
          </form>
  
          <table className="stats-table w-full text-left border border-darkpurple rounded-lg overflow-hidden">
            <thead className="bg-darkpurple">
              <tr>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Month</th>
                <th className="px-4 py-2">Absenteeism</th>
                <th className="px-4 py-2">Overtime</th>
                <th className="px-4 py-2">Turnover</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {statisticsData.map((stat) => (
                <tr key={stat._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{stat.year}</td>
                  <td className="px-4 py-2">{stat.month}</td>
                  <td className="px-4 py-2">{stat.absenteeism}</td>
                  <td className="px-4 py-2">{stat.overtime}</td>
                  <td className="px-4 py-2">{stat.turnover}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditClick(stat)}
                      className="edit-button text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
    onClick={() => handleDeleteStat(stat._id)}
    className="delete-button bg-red-500 text-white rounded-lg px-2 hover:bg-red-600"
  >
    Delete
  </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="histograms">
        <h3>Statistics Histogram</h3>
        <Bar
          data={getStackedBarData()}
          options={stackedBarChartOptions}
        />
      </div>
        </div>
      </div>
    </div>
  );
}
export default ImportEmployeeshc;

 