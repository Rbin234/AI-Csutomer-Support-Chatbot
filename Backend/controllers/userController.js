const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET; // Replace with env variable

// 1. Sign Up
exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success : false, message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ success : true, message: 'User created successfully', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ success : false, error: err.message });
  }
};

// 2. Sign In
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success : false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success : false, message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ success : true, token, userId: user._id });
  } catch (err) {
    res.status(500).json({ success : false, error: err.message });
  }
};

// 3. Get User Data by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ success : false, message: 'User not found' });

    res.json({success : true , record : user});
  } catch (err) {
    res.status(500).json({ success : false, error: err.message });
  }
};
