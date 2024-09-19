// backend/controllers/statistics_p2Controller.js
const StatisticsP2 = require('../models/statistics_p2');

// Get all statistics
exports.getStatisticsp2 = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const statistics = await StatisticsP2.find(query);
        res.json(statistics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new statistics

// Add a new statistic
exports.createStatisticsp2 = async (req, res) => {
  try {
    const { year, month, absenteeism, overtime, turnover } = req.body;

    const newStatistics = new StatisticsP2({
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
exports.updateStatisticsp2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, absenteeism, overtime, turnover } = req.body;

    const updatedStatistics = await StatisticsP2.findByIdAndUpdate(id, {
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


// Delete statistics
exports.deleteStatisticsp2 = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findByIdAndDelete to delete the document directly
    const deletedStatistics = await StatisticsP2.findByIdAndDelete(id);

    if (!deletedStatistics) {
      return res.status(404).json({ message: 'Statistics not found' });
    }

    res.json({ message: 'Statistics deleted' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
