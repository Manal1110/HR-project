const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        // Ensure the directory exists
        const logsDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logsDir)) {
            await fsPromises.mkdir(logsDir);
        }
        // Append the log item to the log file
        await fsPromises.appendFile(path.join(logsDir, logFileName), logItem);
    } catch (err) {
        console.error(err);
    }
};

const logger = async (req, res, next) => {
    const logMessage = `${req.method}\t${req.url}\t${req.headers.origin}`;
    await logEvents(logMessage, 'reqLog.log');
    console.log(`${req.method} ${req.path}`); // Logging request method and path
    next(); // Move to the next middleware or route handler
};

module.exports = {logEvents,logger};
