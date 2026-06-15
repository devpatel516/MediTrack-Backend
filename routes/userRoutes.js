const express = require('express');
const { getAllergies, updateAllergies } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/allergies', authMiddleware, getAllergies);

router.put('/allergies', authMiddleware, updateAllergies);

router.get('/by-email/:email', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ error: 'Access denied. Only doctors can lookup patients by email.' });
        }
        const patient = await User.findOne({ email: req.params.email, role: 'patient' });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json({
            id: patient._id,
            name: patient.name,
            email: patient.email,
            allergies: patient.allergies || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:userId/allergies', authMiddleware, getAllergies);

router.put('/:userId/allergies', authMiddleware, updateAllergies);

module.exports = router;
