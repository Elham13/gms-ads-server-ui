const mongoose = require('mongoose');

const ServiceManagerSchema = new mongoose.Schema({
  name: String,
  password: String,
  phone: String,
});

module.exports = mongoose.model('ServiceManager', ServiceManagerSchema);
