const express = require('express');
const {
  handleGetAllUsers, 
  handleGetUserById, 
  handleUpdateUserById, 
  handleDeleteUserById,
  handleCreateNewUser
} = require("./../controllers/user")

const router = express.Router();

// router.get('/', async (req, res) => {
//   let allUsers = users;
//   let html = "";
//   html += helper.getMenuHtml();
//   html += "<h1>Users</h1>";

//   if (useMongodb) {
//     try {
//       allUsers = await User.find({});
//     } catch (error) {
//       console.error("Error fetching users from MongoDB:", error.message);
//       html += "<h3>Error fetching users</h3>";
//       return res.status(500).send(html);
//     }

//     if (!allUsers || allUsers.length <= 0) {
//       html += "<h3>No Users Found</h3>";
//       return res.status(404).send(html);
//     }
//     allUsers.map((user) => {
//       html += helper.getUserHtml(user, useMongodb);
//     });
//   } else {
//     if (!allUsers || !allUsers.data || allUsers.data.length <= 0) {
//       html += "<h3>No Users Found</h3>";
//       return res.status(404).send(html);
//     }
//     allUsers.data.map((user) => {
//       html += helper.getUserHtml(user, useMongodb);
//     });
//   }

//   return res.status(200).send(html);
// });

// router.get('/:id', async (req, res) => {
//   // let id = req.params.id.trim();
//   let id = req.params.id;
//   let html = "";
//   let user = {};
//   html += helper.getMenuHtml();
//   html += `<h1>User Id(${id})</h1>`;
//   if (useMongodb) {
//     try {
//       user = await User.findById(id);
//       console.log('user', user);
//       if (!user) {
//         html += "<h3>User not Found</h3>";
//         return res.status(404).send(html);
//       }
//     } catch (error) {
//       console.error("Error fetching user from MongoDB:", error.message);
//       html += "<h3>Error fetching user</h3>";
//       return res.status(500).send(html);
//     }
//   } else {
//     id = Number(id);
//     if (!users.data || users.data.length <= 0) {
//       html += "<h3>User not Found</h3>";
//       return res.status(404).send(html);
//     }

//     user = users.data.find((user) => {
//       return user.id  === id
//     });

//     if (!user) {
//       html += "<h3>User not Found</h3>";
//       return res.status(404).send(html);
//     }
//   }

//   html += helper.getUserHtml(user, useMongodb);
//   return res.send(html);
// });


// Route for Json Response

// router.get('/', handleGetAllUsers);
// router.post('/', handleCreateNewUser);

router
  .route('/')
  .get(handleGetAllUsers)
  .post(handleCreateNewUser);


router
  .route('/:id')
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;