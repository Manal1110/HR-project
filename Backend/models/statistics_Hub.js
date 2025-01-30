// backend/models/Statistics_Hub.js
const mongoose = require('mongoose');

const StatisticsHubSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    absenteeism: { type: Number, required: true },
    overtime: { type: Number, required: true },
    turnover: { type: Number, required: true }
});

module.exports = mongoose.model('StatisticsHub', StatisticsHubSchema);
