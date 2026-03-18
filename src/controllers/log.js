const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/get-requests.txt');

exports.logs = (req, res, next) => {
  if (req.method === 'GET') {
    const log = `
[${new Date().toISOString()}]
METHOD : ${req.method}
URL    : ${req.originalUrl}
IP     : ${req.ip}
---------------------------
`;

    fs.appendFile(logFilePath, log, (err) => {
      if (err) console.error('Log write error:', err);
    });
  }

  next();
};