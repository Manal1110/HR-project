// backend/controllers/statistics_HubController.js
const StatisticsHub = require('../models/statistics_Hub');

// Get all statistics
exports.getStatisticsHub = async (req, res) => {
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
exports.createStatisticsHub = async (req, res) => {
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
exports.updateStatisticsHub = async (req, res) => {
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


// Delete statistics
exports.deleteStatisticsHub = async (req, res) => {
    try {
        const statistics = await StatisticsHub.findById(req.params.id);

        if (!statistics) return res.status(404).json({ message: 'Statistics not found' });

        await statistics.remove();
        res.json({ message: 'Statistics deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
