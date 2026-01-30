const mongoose = require('mongoose');


async function connectMongoDb(url) {
  mongoose.connect(url).then(
    () => {
      console.log('Connected to MongoDB');
    }).catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
  // return mongoose.connect(url);
} 

module.exports = {
  connectMongoDb,
}