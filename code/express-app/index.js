const express = require('express');
const users = require('./users_mock_data.json');
const fs = require('fs');
const helper = require('./helper.js');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON and URL-encoded data for post requests
app.use(express.urlencoded({ extended: true }));

// Routes for Html Response
app.get('/', (req, res) => {
  let html = "";
  html += helper.getMenuHtml();
  html += "<h1>Home Page</h1>";
  html += "<h3>Hello, World!</h3>";
  html += "<p>Welcome to the Home Page.</p>";
  return res.send(html);
});

app.get('/about', (req, res) => {
  let html = "";
  html += helper.getMenuHtml();
  html += "<h1>About</h1>";
  html += `<p>Hello, ${req.query.name || 'Guest'}! This is the About Page.</p>`;
  return res.send(html);
});

app.get('/users', (req, res) => {
  let html = "";
  html += helper.getMenuHtml();
  html += "<h1>Users</h1>";
  if (!users.data || users.data.length <= 0) {
    html += "<h3>No Users Found</h3>";
    return res.send(html);
  }

  users.data.map((user) => {
    html += helper.getUserHtml(user);
  });
  return res.send(html);
  
});

app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  let html = "";
  html += helper.getMenuHtml();
  html += `<h1>User Id(${id})</h1>`;

  if (!users.data || users.data.length <= 0) {
    html += "<h3>User not Found</h3>";
    return res.send(html);
  }

  const user = users.data.find((user) => {
    return user.id  === id
  });
  if (!user) {
    html += "<h3>User not Found</h3>";
    return res.send(html);
  }
  html += helper.getUserHtml(user);
  return res.send(html);
});


// Route for Json Response
app.get('/api/users', (req, res) => {
  let resp = {status: -1, message: "Unable to fetch users"};
  if (!users.data || users.data.length <= 0) {
    return res.json(resp);
  }

  resp.status = 1;
  resp.message = 'Users fetched successfully';
  resp.total_records = users.data.length;
  resp.data = users.data;
  return res.json(resp);
});

app.post('/api/users', (req, res) => {
  let resp = {status: -1, message: "Invalid data provided"};
  const body = req.body;
  if (
    !body || 
    !body.first_name || 
    !body.last_name || 
    !body.email || 
    !body.gender || 
    !body.job_title
  ) {
    return res.json(resp);
  }

  let maxId = 1;
  if (users.max_id) {
    maxId = users.max_id
  }
  maxId = maxId + 1;

  const newUser = {
    id: maxId,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title
  };

  users.max_id = maxId;
  users.data.push(newUser);

  fs.writeFile('./users_mock_data.json', JSON.stringify(users), (err, data) => {
    resp.status = 1;
    resp.message = 'User created successfully';
    resp.newUserId = maxId
    return res.json(resp);
  });
});

app
  .route('/api/users/:id')
  .get((req, res) => {
    let resp = {status: -1, message: "Unable to fetch users"};
    if (!users.data || users.data.length <= 0) {
      return res.json(resp);
    }

    const id = Number(req.params.id);
    const user = users.data.find((user) => {
      return user.id  === id
    });
    if (!user) {
      resp.message = "User not found";
      return res.json(resp);
    }
    resp.status = 1;
    resp.message = 'User fetched successfully';
    resp.data = user;
    return res.json(resp);
  })
  .patch((req, res) => {
    return res.json({status: 1, message: 'User updated successfully'});
  })
  .delete((req, res) => {
    return res.json({status: 1, message: 'User deleted successfully'});
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});