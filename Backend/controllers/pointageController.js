const Pointage = require('../models/Pointage');
const xlsx = require('xlsx');
const fs = require('fs');


// Function to get all pointages
const getAllPointages = async (req, res) => {
  try {
    const pointages = await Pointage.find();
    // Format dates
    const formattedPointages = pointages.map(pointage => ({
      ...pointage.toObject(),
      DATE: pointage.DATE.toISOString().split('T')[0] // Convert to YYYY-MM-DD
    }));
    res.json(formattedPointages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to get a pointage by ID
const getPointageById = async (req, res) => {
  try {
    const pointage = await Pointage.findById(req.params.id);
    if (pointage == null) {
      return res.status(404).json({ message: 'Cannot find pointage' });
    }
    // Format date
    const formattedPointage = {
      ...pointage.toObject(),
      DATE: pointage.DATE.toISOString().split('T')[0] // Convert to YYYY-MM-DD
    };
    res.json(formattedPointage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const createPointage = async (req, res) => {
  const pointage = new Pointage({
    DATE: req.body.DATE,
    MATRICULE: req.body.MATRICULE,
    NOM: req.body.NOM,
    PRENOM: req.body.PRENOM,
    UNITE: req.body.UNITE,
    TYPE: req.body.TYPE,
    SERVICE: req.body.SERVICE,
    ENTREE: req.body.ENTREE,
    SORTIE: req.body.SORTIE,
    HN: req.body.HN,
    MOTIF: req.body.MOTIF
  });

  try {
    const newPointage = await pointage.save();
    res.status(201).json(newPointage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePointage = async (req, res) => {
  try {
    const pointage = await Pointage.findById(req.params.id);
    if (pointage == null) {
      return res.status(404).json({ message: 'Cannot find pointage' });
    }

    Object.keys(req.body).forEach(key => {
      pointage[key.toUpperCase()] = req.body[key];
    });

    const updatedPointage = await pointage.save();
    res.json(updatedPointage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePointage = async (req, res) => {
  console.log('Request received:', req.params.id); 
  try {
    const result = await Pointage.deleteOne({ _id: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Pointage not found' });
    }

    console.log('Pointage deleted:', req.params.id);
    res.json({ message: 'Pointage deleted' });
  } catch (err) {
    console.error('Error deleting pointage:', err.message);
    res.status(500).json({ message: err.message });
  }
};


const importPointages = async (req, res) => {
  try {
    const file = req.file.path;

    const workbook = xlsx.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const pointages = xlsx.utils.sheet_to_json(worksheet);

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    const parseTime = (excelTime) => {
      const totalMinutes = excelTime * 24 * 60;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor(totalMinutes % 60);
      const isPM = hours >= 12;
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const amPm = isPM ? 'PM' : 'AM';
      return `${formattedHours}:${formattedMinutes} ${amPm}`;
    };

    for (let pointage of pointages) {
      const newPointage = new Pointage({
        DATE: parseDate(pointage.DATE),
        MATRICULE: pointage.MATRICULE,
        NOM: pointage.NOM,
        PRENOM: pointage.PRENOM,
        UNITE: pointage.UNITE,
        TYPE: pointage.TYPE,
        SERVICE: pointage.SERVICE,
        ENTREE: parseTime(pointage.ENTREE),
        SORTIE: parseTime(pointage.SORTIE),
        HN: pointage.HN,
        MOTIF: pointage.MOTIF
      });

      try {
        await newPointage.save();
      } catch (err) {
        console.error('Error saving pointage:', err);
      }
    }

    fs.unlinkSync(file);
    res.status(201).json({ message: 'Pointages imported successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const analyzePointages = async (req, res) => {
  try {
    const { start, end, motifs } = req.body;

    if (!start || !end || !Array.isArray(motifs)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1); // Inclusive end date

    const pointages = await Pointage.find({
      DATE: { $gte: startDate, $lt: endDate }
    });

    // Filter by selected motifs
    const filteredPointages = pointages.filter(pointage => motifs.includes(pointage.MOTIF));

    // Aggregate data
    const analysisData = {};
    filteredPointages.forEach(pointage => {
      const date = pointage.DATE.toISOString().split('T')[0];
      if (!analysisData[date]) {
        analysisData[date] = { total: 0, motifs: {} };
      }
      analysisData[date].total++;
      analysisData[date].motifs[pointage.MOTIF] = (analysisData[date].motifs[pointage.MOTIF] || 0) + 1;
    });

    // Prepare data for chart
    const labels = Object.keys(analysisData);
    const totals = labels.map(date => analysisData[date].total);
    const datasets = motifs.map(motif => ({
      label: motif,
      data: labels.map(date => analysisData[date].motifs[motif] || 0),
      backgroundColor: generateColor(motif), // Function to generate a color for each motif
      stack: 'stack0',
    }));

    res.json({
      labels,
      datasets: [
        {
          label: 'Total',
          data: totals,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        ...datasets,
      ]
    });
  } catch (err) {
    console.error('Error analyzing data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Helper function to generate colors for motifs
const generateColor = (motif) => {
  const colors = {
    CM: 'rgba(255, 99, 132, 0.2)',
    MAT: 'rgba(54, 162, 235, 0.2)',
    // Add more colors for each motif
  };
  return colors[motif] || 'rgba(255, 159, 64, 0.2)'; // Default color
};




module.exports = {
  getAllPointages,
  getPointageById,
  createPointage,
  updatePointage,
  deletePointage,
  importPointages, 
  analyzePointages
};
