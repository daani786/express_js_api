const express = require('express');
// const users = require('./users_mock_data.json');
// const helper = require('./helper.js');

const {logReqRes} = require('./middlewares');
const {connectMongoDb} = require("./connection")

const userRouter = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 8000;

// const NODE_ENV = process.env.NODE_ENV;
// console.log('NODE_ENV:', NODE_ENV);
// const MONGODB_URL = process.env.MONGODB_URL;
// console.log('MONGODB_URL:', MONGODB_URL);


// MongoDB connection
const mongoUserName = 'root';
const mongoPassword = '1234';
const clusterUrl = 'mongo-db:27017/express_api?authSource=admin'; // e.g., 'localhost:27017/myDB' or Atlas URL part

const dbUrl = `mongodb://${mongoUserName}:${mongoPassword}@${clusterUrl}`;
// console.log('MongoDB URI:', dbUrl);
connectMongoDb(dbUrl);

// Middleware - Plugin
// to parse JSON and URL-encoded data for post requests
app.use(express.urlencoded({ extended: true }));
// log requests to access.log file
app.use(logReqRes('./logs/access.log'));



// // Routes for Html Response
// app.get('/', (req, res) => {
//   let html = "";
//   html += helper.getMenuHtml();
//   html += "<h1>Home Page</h1>";
//   html += "<h3>Hello, World!</h3>";
//   html += "<p>Welcome to the Home Page.</p>";
//   return res.send(html);
// });

// app.get('/about', (req, res) => {
//   let html = "";
//   html += helper.getMenuHtml();
//   html += "<h1>About</h1>";
//   html += `<p>Hello, ${req.query.name || 'Guest'}! This is the About Page.</p>`;
//   return res.send(html);
// });

// Routes
app.use('/api/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});