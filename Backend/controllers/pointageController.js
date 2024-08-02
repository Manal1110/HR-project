// controllers/pointageController.js
const Pointage = require('../models/Pointage');

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
  try {
    const pointage = await Pointage.findById(req.params.id);
    if (pointage == null) {
      return res.status(404).json({ message: 'Cannot find pointage' });
    }

    await pointage.remove();
    res.json({ message: 'Deleted pointage' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllPointages,
  getPointageById,
  createPointage,
  updatePointage,
  deletePointage
};
