// backend/controllers/statistics_HCController.js
const Statisticshc = require('../models/statistics_HC');

// Get all statistics
exports.getStatisticshc = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = {};

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const statistics = await Statisticshc.find(query);
        res.json(statistics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new statistics

// Add a new statistic
exports.createStatisticshc = async (req, res) => {
  try {
    const { year, month, absenteeism, overtime, turnover } = req.body;

    const newStatistics = new Statisticshc({
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
exports.updateStatisticshc = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, absenteeism, overtime, turnover } = req.body;

    const updatedStatistics = await Statisticshc.findByIdAndUpdate(id, {
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
exports.deleteStatisticshc = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findByIdAndDelete to delete the document directly
    const deletedStatistics = await Statisticshc.findByIdAndDelete(id);

    if (!deletedStatistics) {
      return res.status(404).json({ message: 'Statistics not found' });
    }

    res.json({ message: 'Statistics deleted' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
