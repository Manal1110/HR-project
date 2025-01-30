// backend/controllers/statistics_CombuController.js
const StatisticsHub = require('../models/statistics_Combu');

// Get all statistics
exports.getStatisticsCombu = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const statistics = await StatisticsHub.find(query);
        res.json(statistics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new statistics

// Add a new statistic
exports.createStatisticsCombu = async (req, res) => {
  try {
    const { year, month, absenteeism, overtime, turnover } = req.body;

    const newStatistics = new StatisticsHub({
      year,
      month,
      absenteeism,
      overtime,
      turnover
    });

    await newStatistics.save();
    res.status(201).json({ message: 'Statistics added successfully', data: newStatistics });
  } catch (error) {
    res.status(500).json({ message: 'Error adding statistics', error: error.message });
  }
};

// Update existing statistics
exports.updateStatisticsCombu = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, absenteeism, overtime, turnover } = req.body;

    const updatedStatistics = await StatisticsHub.findByIdAndUpdate(id, {
      year,
      month,
      absenteeism,
      overtime,
      turnover
    }, { new: true });

    if (!updatedStatistics) {
      return res.status(404).json({ message: 'Statistics not found' });
    }

    res.status(200).json({ message: 'Statistics updated successfully', data: updatedStatistics });
  } catch (error) {
    res.status(500).json({ message: 'Error updating statistics', error: error.message });
  }
};


exports.deleteStatisticsCombu = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findByIdAndDelete to delete the document directly
    const deletedStatistics = await StatisticsHub.findByIdAndDelete(id);

    if (!deletedStatistics) {
      return res.status(404).json({ message: 'Statistics not found' });
    }

    res.json({ message: 'Statistics deleted' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
