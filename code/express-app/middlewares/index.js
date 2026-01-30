const fs = require('fs');

function logReqRes(filename) {
  return (req, res, next) => {
    let logMsg = `${new Date().toISOString()}: ${req.ip} ${req.method}: ${req.path}\n`;
    fs.appendFile(filename, logMsg, (err, data) => {
      next();
    });
  }
}

module.exports = {
  logReqRes,
}