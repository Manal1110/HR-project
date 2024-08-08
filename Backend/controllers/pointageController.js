const Pointage = require('../models/Pointage');
const xlsx = require('xlsx');
const fs = require('fs');

const getAllPointages = async (req, res) => {
  try {
    const pointages = await Pointage.find();
    res.json(pointages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPointageById = async (req, res) => {
  try {
    const pointage = await Pointage.findById(req.params.id);
    if (pointage == null) {
      return res.status(404).json({ message: 'Cannot find pointage' });
    }
    res.json(pointage);
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
  console.log('Request received:', req.params.id); // Log the ID
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
    console.log('Uploaded file path:', file); 

    const workbook = xlsx.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const pointages = xlsx.utils.sheet_to_json(worksheet);

    console.log('Excel file contents:', pointages);

    // Custom function to parse date in DD/MM/YYYY format
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day); // JavaScript months are 0-based
    };

    for (let pointage of pointages) {
      const newPointage = new Pointage({
        DATE: parseDate(pointage.DATE), // Use the custom parseDate function
        MATRICULE: pointage.MATRICULE,
        NOM: pointage.NOM,
        PRENOM: pointage.PRENOM,
        UNITE: pointage.UNITE,
        TYPE: pointage.TYPE,
        SERVICE: pointage.SERVICE,
        ENTREE: pointage.ENTREE,
        SORTIE: pointage.SORTIE,
        HN: pointage.HN,
        MOTIF: pointage.MOTIF
      });

      try {
        await newPointage.save();
        console.log('Saved pointage:', newPointage); // Log the saved pointage
      } catch (err) {
        console.error('Error saving pointage:', err); // Log any errors during saving
      }
    }

    fs.unlinkSync(file); // Delete the file after processing
    res.status(201).json({ message: 'Pointages imported successfully' });
  } catch (err) {
    console.error('Error importing pointages:', err); 
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllPointages,
  getPointageById,
  createPointage,
  updatePointage,
  deletePointage,
  importPointages
};
