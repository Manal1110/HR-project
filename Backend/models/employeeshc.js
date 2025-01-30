const mongoose = require('mongoose');

const employeehcSchema = new mongoose.Schema({
  Date:{ type: String},
  Mat: { type: String, required: true },
  Nom: { type: String, required: true },
  Prénom: { type: String, required: true },
  Type: { type: String, required: true },
  UNITE: { type: String, required: true },
  Service: { type: String, required: true },
  "Site de transfert": { type: String },
  "Date d'ancienneté": { type: Date },
  "Date embauche": { type: Date },
  Fonction: { type: String },
  Département: { type: String },
  Sexe: { type: String },
  Unité: { type: String },
  "TYPE Contrat": { type: String },
  "DATE DE RENOUVELLEMENT DE CONTRAT": { type: Date },
  CC: { type: String },
  "type CC": { type: String },
  "type CC central fonction": { type: String },
  situation: { type: String },
  "MOTIF STC": { type: String },
  "Countif stc": { type: String },
  "Motif inactif": { type: String },
  "Countif inact": { type: String },
  "COUNTIF YMO": { type: String },
  BU: { type: String },
  site: { type: String },
  SITE2: { type: String },
  Projet: { type: String },
  "Total Production": { type: String },
  "CHEF DIRECT": { type: String },
  month: { type: String, required: true },
});


module.exports = mongoose.model('Employeehc', employeehcSchema);
