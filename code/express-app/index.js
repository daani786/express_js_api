const express = require('express');
const users = require('./users_mock_data.json');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

let menuHtml = "";
menuHtml += "<ul>";
menuHtml += "<li><a href='/'>Home</a></li>";
menuHtml += "<li><a href='/about'>About Page</a></li>";
menuHtml += "<li><a href='/about?name=Adnan'>About Page (Adnan)</a></li>";
menuHtml += "<li><a href='/users'>Users</a></li>";
menuHtml += "<li><a href='/api/users'>Api Users</a></li>";
menuHtml += "</ul>";

// Routes for Html Response
app.get('/', (req, res) => {
  let html = "";
  html += menuHtml;
  html += "<h1>Home Page</h1>";
  html += "<h3>Hello, World!</h3>";
  html += "<p>Welcome to the Home Page.</p>";
  return res.send(html);
});

app.get('/about', (req, res) => {
  let html = "";
  html += menuHtml;
  html += "<h1>About</h1>";
  html += `<p>Hello, ${req.query.name || 'Guest'}! This is the About Page.</p>`;
  return res.send(html);
});

app.get('/users', (req, res) => {
  let html = "";
  html += menuHtml;
  html += "<h1>Users</h1>";
  if (!users.data || users.data.length <= 0) {
    html += "<h3>No Users Found</h3>";
    return res.send(html);
  }

  users.data.map((user) => {
    html += getUserHtml(user);
  });
  return res.send(html);
  
});

app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  let html = "";
  html += menuHtml;
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
  html += getUserHtml(user);
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
  resp.data = users.data;
  return res.json(resp);
});

app.post('/api/users', (req, res) => {
  const body = req.body;
  console.log('body', body);
  return res.json({status: 1, message: 'User created successfully'});
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

const getUserHtml = (user) => {
  let html = "";
  html += "<ul>";
  html += `<li>Id: ${user.id}</li>`;
  html += `<li>Name: ${user.first_name} ${user.last_name}</li>`;
  html += `<li>Email: ${user.email}</li>`;
  html += `<li>Gender: ${user.gender}</li>`;
  html += `<li>Job Title: ${user.job_title}</li>`;
  html += `<li><a href='/users/ ${user.id}'>Link</a></li>`;
  html += `<li><a href='/api/users/ ${user.id}'>Json Link</a></li>`;
  html += "</ul>";
  return html;
}