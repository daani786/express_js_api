const express = require('express');
const users = require('./users_mock_data.json');
const fs = require('fs');
const helper = require('./helper.js');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 8000;
const useMongodb = true

const NODE_ENV = process.env.NODE_ENV;
console.log('NODE_ENV:', NODE_ENV);
const MONGODB_URL = process.env.MONGODB_URL;
console.log('MONGODB_URL:', MONGODB_URL);


// MongoDB connection
const mongoUserName = 'root';
const mongoPassword = '1234';
const clusterUrl = 'mongo-db:27017/express_api?authSource=admin'; // e.g., 'localhost:27017/myDB' or Atlas URL part

// For local or standard connections
const uri = `mongodb://${mongoUserName}:${mongoPassword}@${clusterUrl}`;
console.log('MongoDB URI:', uri);

mongoose.connect(uri).then(
  () => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
// User Schema and Model
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);


// Middleware to parse JSON and URL-encoded data for post requests
app.use(express.urlencoded({ extended: true }));

// Middleware to log requests to access.log file
app.use((req, resp, next) => {
  let logMsg = `${new Date().toISOString()}: ${req.ip} ${req.method}: ${req.path}\n`;
  fs.appendFile('./logs/access.log', logMsg, (err, data) => {
    next();
  });
})

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

app.get('/users', async (req, res) => {
  let allUsers = users;
  let html = "";
  html += helper.getMenuHtml();
  html += "<h1>Users</h1>";

  if (useMongodb) {
    try {
      allUsers = await User.find({});
    } catch (error) {
      console.error("Error fetching users from MongoDB:", error.message);
      html += "<h3>Error fetching users</h3>";
      return res.status(500).send(html);
    }

    if (!allUsers || allUsers.length <= 0) {
      html += "<h3>No Users Found</h3>";
      return res.status(404).send(html);
    }
    allUsers.map((user) => {
      html += helper.getUserHtml(user, useMongodb);
    });
  } else {
    if (!allUsers || !allUsers.data || allUsers.data.length <= 0) {
      html += "<h3>No Users Found</h3>";
      return res.status(404).send(html);
    }
    allUsers.data.map((user) => {
      html += helper.getUserHtml(user, useMongodb);
    });
  }

  return res.status(200).send(html);
});

app.get('/users/:id', async (req, res) => {
  // let id = req.params.id.trim();
  let id = req.params.id;
  let html = "";
  let user = {};
  html += helper.getMenuHtml();
  html += `<h1>User Id(${id})</h1>`;
  if (useMongodb) {
    try {
      user = await User.findById(id);
      console.log('user', user);
      if (!user) {
        html += "<h3>User not Found</h3>";
        return res.status(404).send(html);
      }
    } catch (error) {
      console.error("Error fetching user from MongoDB:", error.message);
      html += "<h3>Error fetching user</h3>";
      return res.status(500).send(html);
    }
  } else {
    id = Number(id);
    if (!users.data || users.data.length <= 0) {
      html += "<h3>User not Found</h3>";
      return res.status(404).send(html);
    }

    user = users.data.find((user) => {
      return user.id  === id
    });

    if (!user) {
      html += "<h3>User not Found</h3>";
      return res.status(404).send(html);
    }
  }

  html += helper.getUserHtml(user, useMongodb);
  return res.send(html);
});


// Route for Json Response
app.get('/api/users', async (req, res) => {
  let resp = {status: -1, message: "Unable to fetch users"};
  if (useMongodb) {
    try {
      allUsers = await User.find({});
    } catch (error) {
      console.error("Error fetching users from MongoDB:", error.message);
      html += "<h3>Error fetching users</h3>";
      return res.status(500).send(html);
    }

    if (!allUsers || allUsers.length <= 0) {
      return res.status(404).json(resp);
    }
    
    resp.data = allUsers;
    resp.total_records = allUsers.length;
  } else {
    if (!users || !users.data || users.data.length <= 0) {
      return res.status(404).json(resp);
    }
    resp.data = users.data;
    resp.total_records = users.data.length;
  }

  resp.status = 1;
  resp.message = 'Users fetched successfully';

  return res.status(200).json(resp);
});

app.post('/api/users', async (req, res) => {
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
    return res.status(400).json(resp);
  }

  if (useMongodb) {
    try {
      const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title
      });
      resp.status = 1;
      resp.message = 'User created successfully';
      resp.result = result;
      return res.status(201).json(resp);
    } catch (error) {
      console.error("Error creating document:", error.message);
      if (error.code === 11000) {
        resp.message = 'Duplicate key error encountered.';
      } else {
        resp.message = error.message;
      }
      return res.status(500).json(resp);
    }
  } else {
    // Using mock data file
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
      return res.status(201).json(resp);
    });
  }
});

app
  .route('/api/users/:id')
  .get(async (req, res) => {
    let resp = {status: -1, message: "Unable to fetch user"};
    let id = req.params.id;
    let user = {};
    if (useMongodb) {
      try {
        user = await User.findById(id);
        console.log('user', user);
        if (!user) {
          resp.message = "User not found";
          return res.status(404).json(resp);
        }
      } catch (error) {
        console.error("Error fetching user from MongoDB:", error.message);
        resp.message = "Error fetching user from MongoDB";
        return res.status(500).json(resp);
      }
    } else {
      id = Number(id);
      if (!users || !users.data || users.data.length <= 0) {
        return res.status(404).json(resp);
      }
      const user = users.data.find((user) => {
        return user.id  === id
      });
      if (!user) {
        resp.message = "User not found";
        return res.status(404).json(resp);
      }
    }

    resp.status = 1;
    resp.message = 'User fetched successfully';
    resp.data = user;
    return res.status(200).json(resp);
  })
  .patch(async (req, res) => {
    const fields = ['first_name', 'last_name', 'email', 'gender', 'job_title'];
    const fieldsForMongodb = {
      'first_name' : 'firstName', 
      'last_name': 'lastName', 
      'email': 'email', 
      'gender': 'gender', 
      'job_title': 'jobTitle'
    };
    let resp = {status: -1, message: "no data provided"};
    let id = req.params.id;
    let user = {};
    const body = req.body;
    if (!body) {
      return res.status(400).json(resp);
    }

    if (useMongodb) {
      try {
        user = await User.findById(id);
        if (!user) {
          resp.message = "User not found";
          return res.status(404).json(resp);
        }
      } catch (error) {
        console.error("Error fetching user from MongoDB:", error.message);
        resp.message = "Error fetching user from MongoDB";
        return res.status(500).json(resp);
      }
      let dataToUpdate = {};
      let nbFieldsUpdated = 0;
      for (const key in body) {
        if (
          body.hasOwnProperty(key) &&
          fields.includes(key) &&
          fieldsForMongodb.hasOwnProperty(key) &&
          user[fieldsForMongodb[key]] !== undefined
        ) {
          dataToUpdate[fieldsForMongodb[key]] = body[key];
          nbFieldsUpdated++;
        }
      }
      if (nbFieldsUpdated === 0) {
        resp.status = -1;
        resp.message = "No valid fields to update";
        return res.status(400).json(resp);
      }
      console.log('dataToUpdate', dataToUpdate);
      try {
        let result = await User.findByIdAndUpdate(id, dataToUpdate);
        console.log('result', result);
        resp.status = 1;
        resp.message = 'User updated successfully';
        return res.status(200).json(resp);
      } catch (error) {
        console.error("Error updating user in MongoDB:", error.message);
        resp.message = "Error updating user in MongoDB";
        return res.status(500).json(resp);
      }
    } else {
      if (!users || !users.data || users.data.length <= 0) {
        resp.message = "Unable to fetch users";
        return res.status(404).json(resp);
      }
      
      id = Number(id);
      let userIndex = users.data.findIndex((user) => {
        return user.id  === id
      });
      if (!userIndex || userIndex === -1) {
        resp.message = "User not found";
        return res.status(404).json(resp);
      }
      user = users.data[userIndex];

      let nbFieldsUpdated = 0;
      for (const key in body) {
        if (
          body.hasOwnProperty(key) &&
          fields.includes(key) &&
          user.hasOwnProperty(key)
        ) {
          user[key] = body[key];
          nbFieldsUpdated++;
        }
      }
      if (nbFieldsUpdated === 0) {
        resp.status = -1;
        resp.message = "No valid fields to update";
        return res.status(400).json(resp);
      }
      
      users.data[userIndex] = user;
      fs.writeFile('./users_mock_data.json', JSON.stringify(users), (err, data) => {
        resp.status = 1;
        resp.message = 'User updated successfully';
        return res.status(200).json(resp);
      });
    }
  })
  .delete(async (req, res) => {
    let id = req.params.id;
    let resp = {status: -1, message: "Unable to fetch users"};
    if (useMongodb) {
      try {
        let result = await User.findByIdAndDelete(id);
        console.log('result', result);
        if (!result) {
          resp.message = "User not found";
          return res.status(404).json(resp);
        }
        resp.status = 1;
        resp.message = 'User deleted successfully';
        return res.status(200).json(resp);
      } catch (error) {
        console.error("Error deleting user in MongoDB:", error.message);
        resp.message = "Error deleting user in MongoDB";
        return res.status(500).json(resp);
      }
    } else {
      if (!users || !users.data || users.data.length <= 0) {
        return res.status(404).json(resp);
      }
      id = Number(id);
      let userIndex = users.data.findIndex((user) => {
        return user.id  === id
      });
      if (!userIndex || userIndex === -1) {
        resp.message = "User not found";
        return res.status(404).json(resp);
      }
      console.log('userIndex', userIndex);
      users.data.splice(userIndex, 1);
      fs.writeFile('./users_mock_data.json', JSON.stringify(users), (err, data) => {
        resp.status = 1;
        resp.message = 'User deleted successfully';
        return res.status(200).json(resp);
      });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});