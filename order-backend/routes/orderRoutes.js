const express = require('express');
const router = express.Router();
const Executive = require('../models/Executive');
const Requirement = require('../models/Requirement');
const Order = require('../models/Order');

const ExecutiveTarget = require('../models/ExecutiveTarget');
// GET all executives
router.get('/executives', async (req, res) => {
  try {
    const executives = await Executive.find();
    res.json(executives);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch executives' });
  }
});

// GET all requirements
router.get('/requirements', async (req, res) => {
  try {
    const requirements = await Requirement.find();
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});

// POST a new order with auto-generated year-based orderNo
router.post('/submit', async (req, res) => {
  try {
    const { orderDate } = req.body;
    if (!orderDate) {
      return res.status(400).json({ error: 'Order date is required' });
    }

    const orderYear = new Date(orderDate).getFullYear().toString().slice(-2); // e.g. '25'
    const orderPrefix = `GMS${orderYear}`;

    // Find the last order for that year prefix
    const lastOrder = await Order.findOne({ orderNo: { $regex: `^${orderPrefix}` } })
      .sort({ createdAt: -1 });

    let nextNumber = 1; // Start from 1 if no order found
    if (lastOrder && lastOrder.orderNo) {
      const lastNum = parseInt(lastOrder.orderNo.slice(5)); // skip 'GMS25'
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }

    const paddedNum = String(nextNumber).padStart(3, '0'); // e.g. 001, 002
    const newOrderNo = `${orderPrefix}${paddedNum}`;       // e.g. GMS25001

    const newOrder = new Order({ ...req.body, orderNo: newOrderNo });
    await newOrder.save();

    res.json({ message: 'Order saved successfully', order: newOrder });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});


// GET all orders (for View Orders page)
router.get('/orders', async (req, res) => {
  try {
    // Check if user is an executive or admin
    if (req.query.role === 'Executive') {
      // If executive, fetch only their orders
      const executiveOrders = await Order.find({ executive: req.query.name });
      return res.json(executiveOrders);
    }

    // Admin can see all orders
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET pending payments (balance > 0)
router.get('/orders/pending-payments', async (req, res) => {
  try {
    const pendingPayments = await Order.find({ balance: { $gt: 0 } });
    res.json(pendingPayments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending payments' });
  }
});

// GET pending services (isCompleted: false or deliveryDate in future)
router.get('/orders/pending-services', async (req, res) => {
  try {
    const pendingServices = await Order.find({
      $or: [
        { 'rows.isCompleted': false },
        { 'rows.deliveryDate': { $gt: new Date() } }
      ]
    });
    res.json(pendingServices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending services' });
  }
});

// Mark order as paid (for Pending Payments)
router.put('/orders/:id/mark-paid', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { balance: 0, paymentDate: new Date() },
      { new: true }
    );
    res.json({ message: 'Order marked as paid', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Mark service as completed (for Pending Services)
router.put('/orders/:id/mark-completed', async (req, res) => {
  try {
    const { rowIndex } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (rowIndex >= 0 && rowIndex < order.rows.length) {
      order.rows[rowIndex].isCompleted = true;
      await order.save();
      res.json({ message: 'Service marked as completed', order });
    } else {
      res.status(400).json({ error: 'Invalid row index' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service status' });
  }
});


// GET executive orders by name (for filtering by executive)
router.get('/executive/:name', async (req, res) => {
  try {
    const orders = await Order.find({ executive: req.params.name });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch executive orders' });
  }
});



// POST: Set target for an executive for a particular month and year
router.post('/set-target', async (req, res) => {
  try {
    const { executive, target, month, year } = req.body;

    // Check if target is already set for the executive for the given month and year
    const existingTarget = await ExecutiveTarget.findOne({ executive, targetMonth: month, targetYear: year });

    if (existingTarget) {
      return res.status(400).json({ error: 'Target already set for this executive for the specified month' });
    }

    const newTarget = new ExecutiveTarget({
      executive,
      target,
      targetMonth: month,
      targetYear: year,
    });

    await newTarget.save();
    res.json({ message: 'Target set successfully', target: newTarget });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to set target' });
  }
});

// GET: Fetch target for an executive for a particular month and year
router.get('/get-target/:executive/:month/:year', async (req, res) => {
  try {
    const { executive, month, year } = req.params;

    const target = await ExecutiveTarget.findOne({ executive, targetMonth: month, targetYear: year });

    if (!target) {
      return res.status(404).json({ error: 'Target not found for this executive for the specified month' });
    }

    res.json({ target: target.target });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch target' });
  }
});
// PUT: Update an existing order
router.put('/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});


module.exports = router;
