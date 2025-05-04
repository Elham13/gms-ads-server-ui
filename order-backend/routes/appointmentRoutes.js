const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointmentModel');

// POST - Schedule a new appointment
router.post('/appointments', async (req, res) => {
  try {
    console.log('Incoming appointment data:', req.body);
    const appointment = new Appointment({
      ...req.body,
      status: 'pending' // mark newly created appointment as pending
    });
    await appointment.save();
    res.status(201).json({ message: 'Appointment scheduled successfully' });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ error: 'Failed to schedule appointment' });
  }
});

// GET - Fetch all appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// ✅ NEW: Get only pending appointments (for Selected Appointments)
router.get('/appointments/pending', async (req, res) => {
  try {
    const pendingAppointments = await Appointment.find({ status: 'pending' }).sort({ date: 1 });
    res.status(200).json(pendingAppointments);
  } catch (error) {
    console.error('Error fetching pending appointments:', error);
    res.status(500).json({ error: 'Failed to fetch pending appointments' });
  }
});

// ✅ NEW: Get only assigned appointments for a specific executive (for New Appointments)
router.get('/appointments/assigned/:executiveName', async (req, res) => {
  try {
    const assignedAppointments = await Appointment.find({
      status: 'assigned',
      executiveName: req.params.executiveName
    }).sort({ date: 1 });
    res.status(200).json(assignedAppointments);
  } catch (error) {
    console.error('Error fetching assigned appointments:', error);
    res.status(500).json({ error: 'Failed to fetch assigned appointments' });
  }
});

// PUT - Assign an executive
router.put('/appointments/:id/assign', async (req, res) => {
  const { executiveName } = req.body;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { executiveName, status: 'assigned' },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(updatedAppointment);
  } catch (err) {
    console.error('Error assigning executive:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
// PUT - Update appointment status
router.put('/appointments/:id/status', async (req, res) => {
  const { status } = req.body; // Extract status from the request body
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status }, // Update the status field
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});

module.exports = router;
