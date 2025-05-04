const mongoose = require('mongoose');

const ServiceExecutiveSchema = new mongoose.Schema({
  name: String,
  password: String,
  phone: String,
});

module.exports = mongoose.model('ServiceExecutive', ServiceExecutiveSchema);
