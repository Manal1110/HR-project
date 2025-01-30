// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const { logEvents } = require('./middleware/logger');
const statisticsHubRoutes = require('./routes/statistics_HubRoutes');
const statisticsCombuRoutes = require('./routes/statistics_CombuRoutes');
const statisticsHCRoutes = require('./routes/statistics_HCRoutes');
const statisticsP2Routes = require('./routes/statistics_P2Routes');



console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/employees', require('./routes/employeeRoutes'));
app.use('/pointage', require('./routes/pointage'));
app.use('/gender', require('./routes/genderRoutes'));
app.use('/employeeshub', require('./routes/employeeshubRoutes'));
app.use('/employeescombu', require('./routes/employeescombuRoutes'));
app.use('/employeeshc', require('./routes/employeesHCRoutes'));
app.use('/employeeshc', require('./routes/employeesHCRoutes'));
app.use('/employeesp2', require('./routes/employeesp2Routes'));
app.use('/statisticshub', statisticsHubRoutes);
app.use('/statisticsCombu', statisticsCombuRoutes);
app.use('/statisticshc', statisticsHCRoutes);
app.use('/statisticsp2', statisticsP2Routes);




app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  const logMessage = `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`;
  logEvents(logMessage, 'mongoErrlog.log');
});
