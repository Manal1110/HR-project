// models/Pointage.js
const mongoose = require('mongoose');

const pointageSchema = new mongoose.Schema({
  DATE: { type: Date, required: true },
  MATRICULE: { type: Number, required: true },
  NOM: { type: String, required: true },
  PRENOM: { type: String, required: true },
  UNITE: { type: String, required: true },
  TYPE: { type: String, required: true },
  SERVICE: { type: String, required: true },
  ENTREE: { type: String, required: true },
  SORTIE: { type: String, required: true },
  HN: { type: Number, required: true },
  MOTIF: { type: String }
});

module.exports = mongoose.model('Pointage', pointageSchema);
