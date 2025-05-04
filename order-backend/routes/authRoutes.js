const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Executive = require('../models/Executive');
const Admin = require('../models/Admin');
const Designer = require('../models/Designer');
const Account = require('../models/Account');
const ServiceExecutive = require('../models/ServiceExecutive');
const ServiceManager = require('../models/ServiceManager');
const SalesManager = require('../models/SalesManager');
// ✅ Login route for Executive, Admin, Designer, Account
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    // Check Executive
    const executive = await Executive.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i'),
      password: password.trim()
    });
    if (executive) {
      return res.json({ success: true, role: 'Executive', name: executive.name });
    }

    // Check Admin
    const admin = await Admin.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i'),
      password: password.trim()
    });
    if (admin) {
      return res.json({ success: true, role: 'Admin', name: admin.name });
    }

    // Check Designer
    const designer = await Designer.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i'),
      password: password.trim()
    });
    if (designer) {
      return res.json({ success: true, role: 'Designer', name: designer.name });
    }

    // Check Account
    const account = await Account.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i'),
      password: password.trim()
    });
    if (account) {
      return res.json({ success: true, role: 'Account', name: account.name });
    }

    return res.status(401).json({ success: false, message: 'Name or Password is Incorrect' });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});


// ✅ Route to add an Executive
router.post('/add-executive', async (req, res) => {
  const { name, password, phone } = req.body;

  try {
    // Check if executive already exists
    const existingExecutive = await Executive.findOne({ name });
    if (existingExecutive) {
      return res.status(400).send('Executive already exists');
    }

    // Create a new executive
    const newExecutive = new Executive({ name, password, phone });
    await newExecutive.save();
    res.status(201).send('Executive added successfully');
  } catch (err) {
    console.error('Error saving executive:', err);
    res.status(500).send('Error saving executive');
  }
});

// ✅ Route to add an Admin
router.post('/add-admin', async (req, res) => {
  const { name, password, phone } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ name });
    if (existingAdmin) {
      return res.status(400).send('Admin already exists');
    }

    // Create a new admin
    const newAdmin = new Admin({ name, password, phone });
    await newAdmin.save();
    res.status(201).send('Admin added successfully');
  } catch (err) {
    console.error('Error saving admin:', err);
    res.status(500).send('Error saving admin');
  }
});

// ✅ Route to add a Designer
router.post('/add-designer', async (req, res) => {
  const { name, password, phone } = req.body;

  try {
    const existing = await Designer.findOne({ name });
    if (existing) {
      return res.status(400).send('Designer already exists');
    }

    const newUser = new Designer({ name, password, phone });
    await newUser.save();
    res.status(201).send('Designer added successfully');
  } catch (err) {
    console.error('Error saving designer:', err);
    res.status(500).send('Error saving designer');
  }
});

// ✅ Route to add an Account
router.post('/add-account', async (req, res) => {
  const { name, password, phone } = req.body;

  try {
    const existing = await Account.findOne({ name });
    if (existing) {
      return res.status(400).send('Account user already exists');
    }

    const newUser = new Account({ name, password, phone });
    await newUser.save();
    res.status(201).send('Account user added successfully');
  } catch (err) {
    console.error('Error saving account user:', err);
    res.status(500).send('Error saving account user');
  }
});

// GET executive dashboard data
router.get('/executive-dashboard-data', async (req, res) => {
  try {
    const { executiveName, month, year } = req.query;

    if (!executiveName) {
      return res.status(400).json({ error: 'Executive name is required' });
    }

    // Build date range if month and year are provided
    let startDate = null;
    let endDate = null;
    if (month && year) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 1);
    }

    // Filter orders by executive
    const query = { executive: executiveName };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(query);

    // Achieved orders
    const achieved = orders.length;

    // Total target (assuming each order is 1 point, or use your own logic)
    const target = 20; // Replace with actual monthly target logic if needed

    // Pending Payments
    const pendingPayments = orders.filter(order => order.balance > 0).length;

    // Pending Services
    const pendingServices = orders.reduce((count, order) => {
      order.rows.forEach(row => {
        if (!row.isCompleted) count++;
      });
      return count;
    }, 0);

    res.json({
      executive: executiveName,
      target,
      achieved,
      pendingPayments,
      pendingServices,
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Add Service Executive
router.post('/add-service-executive', async (req, res) => {
  const { name, password, phone } = req.body;

  try {
    const existing = await ServiceExecutive.findOne({ name });
    if (existing) {
      return res.status(400).send('Service Executive already exists');
    }

    const newUser = new ServiceExecutive({ name, password, phone });
    await newUser.save();
    res.status(201).send('Service Executive added successfully');
  } catch (err) {
    res.status(500).send('Error saving Service Executive');
  }
});

// Add Service Manager
router.post('/add-service-manager', async (req, res) => {
  const { name, password, phone } = req.body;

  try {
    const existing = await ServiceManager.findOne({ name });
    if (existing) {
      return res.status(400).send('Service Manager already exists');
    }

    const newUser = new ServiceManager({ name, password, phone });
    await newUser.save();
    res.status(201).send('Service Manager added successfully');
  } catch (err) {
    res.status(500).send('Error saving Service Manager');
  }
});

// Add Sales Manager
router.post('/add-sales-manager', async (req, res) => {
  const { name, password, phone } = req.body;

  try {
    const existing = await SalesManager.findOne({ name });
    if (existing) {
      return res.status(400).send('Sales Manager already exists');
    }

    const newUser = new SalesManager({ name, password, phone });
    await newUser.save();
    res.status(201).send('Sales Manager added successfully');
  } catch (err) {
    res.status(500).send('Error saving Sales Manager');
  }
});
module.exports = router;
