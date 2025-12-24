const express = require('express');
const users = require('./users_mock_data.json');

const app = express();
const PORT = process.env.PORT || 8000;

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
  users.map((user) => {
    html += getUserHtml(user);
  });  
  return res.send(html);
});

app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => {
    return user.id  === id
  });
  let html = "";
  html += menuHtml;
  html += "<h1>User</h1>";
  html += getUserHtml(user);
  return res.send(html);
});

app.get('/api/users', (req, res) => {
  return res.json(users);
});

app
  .route('/api/users/:id')
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => {
      return user.id  === id
    });
    return res.json(user);
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