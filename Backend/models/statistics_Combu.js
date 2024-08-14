// backend/models/Statistics_Combu.js
const mongoose = require('mongoose');

const StatisticsCombuSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    absenteeism: { type: Number, required: true },
    overtime: { type: Number, required: true },
    turnover: { type: Number, required: true }
});

module.exports = mongoose.model('StatisticsCombu', StatisticsCombuSchema);
