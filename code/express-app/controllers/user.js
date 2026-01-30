const User = require ('../models/user');

const useMongodb = true;

async function handleGetAllUsers (req, res) {
  console.log('handleGetAllUsers');
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
}

async function handleGetUserById (req, res) {
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
} 

async function handleUpdateUserById (req, res) {
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
}

async function handleDeleteUserById(req, res) {
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
}

async function handleCreateNewUser (req, res) {
  let resp = {status: -1, message: "Invalid data provided"};
  const body = req.body;
  console.log('body', body);
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
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser
}