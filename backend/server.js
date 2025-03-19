// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const colors = require('colors')

// Initialize dotenv
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(colors.green('MongoDB connected')))
.catch(err => console.log('MongoDB connection error:', err));

/* ------------------------ 🔹 USER AUTHENTICATION ------------------------ */

// User Schema and Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });
    
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        name: newUser.name,
        email: newUser.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        name: user.name,
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/* ------------------------ 🔹 AUCTION SYSTEM ------------------------ */

// Auction Schema
const AuctionSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  startingBid: { type: Number, required: true },
  endTime: { type: Date, required: true },
  imageUrl: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Auction = mongoose.model('Auction', AuctionSchema);

// Multer Storage Configuration for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route to Post an Auction
app.post('/api/auctions', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { itemName, description, startingBid, endTime } = req.body;
    if (!itemName || !description || !startingBid || !endTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAuction = new Auction({
      itemName,
      description,
      startingBid,
      endTime,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      user: req.user.userId
    });

    await newAuction.save();
    res.status(201).json({ message: 'Auction created successfully', auction: newAuction });
  } catch (error) {
    console.error('Auction post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to Fetch All Auctions
app.get('/api/auctions', async (req, res) => {
  try {
    const auctions = await Auction.find().populate('user', 'name email');
    res.json(auctions);
  } catch (error) {
    console.error('Fetch auctions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to Get a Single Auction
app.get('/api/auctions/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate('user', 'name email');
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    res.json(auction);
  } catch (error) {
    console.error('Fetch auction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
