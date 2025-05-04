const mongoose = require('mongoose');

const SalesManagerSchema = new mongoose.Schema({
  name: String,
  password: String,
  phone: String,
});

module.exports = mongoose.model('SaleshManager', SalesManagerSchema);
