// const http = require('http');
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;
const logFile = './logs/access.log';

app.get('/', (req, res) => {
  // const log = `${Date.now()}: ${req.url} New request received\n`;
  // fs.appendFileSync(logFile, log, (err, data) => {
    return res.send('Hello, World! Home Page.');
  // });
});

app.get('/about', (req, res) => {
  // const log = `${Date.now()}: ${req.url} New request received\n`;
  //fs.appendFileSync(logFile, log, (err, data) => {
    return res.send(`Hello, ${req.query.name || 'Guest'}! This is the About Page.`);
  // });
});


// const server = http.createServer(app);

// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});