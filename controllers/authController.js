

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(' Login attempt:', email); 
    
   
    if (!email || !password) {
      console.log(' Missing email or password');
      return res.status(400).json({ 
        message: 'Email and password are required',
        field: !email ? 'email' : 'password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    console.log(' User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log(' User not found:', email);
      return res.status(400).json({ 
        message: 'Invalid credentials or account inactive',
        code: 'USER_NOT_FOUND'
      });
    }

   
    if (user.status !== 'ACTIVE') {
      console.log(' Account inactive:', email);
      return res.status(400).json({ 
        message: 'Account is inactive. Contact admin.',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log(' Password match:', isMatch);
    
    if (!isMatch) {
      console.log(' Wrong password for:', email);
      return res.status(400).json({ 
        message: 'Invalid credentials',
        code: 'WRONG_PASSWORD'
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        fullName: user.fullName, 
        phone: user.phone, 
        preferredChannel: user.preferredChannel 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log(' Login successful:', email);

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        preferredChannel: user.preferredChannel
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};