

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

//  active farmers (for buyers)
router.get('/farmers', auth, async (req, res) => {
  try {
    const farmers = await User.find({ 
      role: 'FARMER', 
      status: 'ACTIVE' 
    }).select('_id fullName phone preferredChannel');
    
    console.log(`Sending ${farmers.length} farmers to buyer ${req.user.id}`);
    res.json(farmers);
  } catch (error) {
    console.error('Error fetching farmers:', error);
    res.status(500).json({ message: error.message });
  }
});

// active buyers (for resale)
router.get('/buyers', auth, async (req, res) => {
  try {
    const buyers = await User.find({ 
      role: 'BUYER', 
      status: 'ACTIVE',
      _id: { $ne: req.user.id } // Exclude current user
    }).select('_id fullName phone preferredChannel');
    
    res.json(buyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN ONLY: Get all users(He can has access to all users)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN ONLY: Create user
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { email, password, fullName, phone, role, preferredChannel } = req.body;
    
    const user = new User({
      email,
      password: password || 'password123',
      fullName,
      phone,
      role,
      preferredChannel: preferredChannel || 'WHATSAPP'
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN ONLY: Toggle user status
router.patch('/:id/toggle-status', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;