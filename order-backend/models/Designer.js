const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  password: String,
});

module.exports = mongoose.model('Designer', designerSchema);
