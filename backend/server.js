// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const colors = require('colors');
const fs = require('fs');

// Initialize dotenv
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));  
app.use(express.json());

// Serve static files from the uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Add logging middleware for debugging
app.use((req, res, next) => {
  if (req.path.startsWith('/uploads/')) {
    console.log('Accessing file:', req.path);
    console.log('Full file path:', path.join(uploadsPath, req.path.replace('/uploads/', '')));
  }
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(colors.green('MongoDB connected')))
.catch(err => console.log('MongoDB connection error:', err));

/* ------------------------ 🔹 USER AUTHENTICATION ------------------------ */

// User Schema and Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  location: { type: String, default: "Not specified" },
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


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = decoded; // Add user payload to the request
    next();
  });
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
  sellerName: {type: String, required: true},
  sellerEmail: {type: String, required: true},
  category: {type: String, required: true},
  description: { type: String, required: true },
  startingBid: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  endTime: { type: Date, required: true },
  images: [],
  createdAt: { type: Date, default: Date.now }
});

const Auction = mongoose.model('Auction', AuctionSchema);

// Bid Schema
const BidSchema = new mongoose.Schema({
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidderName: { type: String, required: true },
  bidderEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  isAutoBid: { type: Boolean, default: false },
  maxAutoBidAmount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

const Bid = mongoose.model('Bid', BidSchema);

// Multer Storage Configuration for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.originalname); // Debug log
    console.log('File mimetype:', file.mimetype); // Debug log
    
    // Check both file extension and mimetype
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const isAllowedMimeType = allowedMimeTypes.includes(file.mimetype);
    const isAllowedExtension = allowedExtensions.includes(fileExtension);
    
    console.log('File extension:', fileExtension); // Debug log
    console.log('Is allowed mime type:', isAllowedMimeType); // Debug log
    console.log('Is allowed extension:', isAllowedExtension); // Debug log
    
    if (!isAllowedMimeType || !isAllowedExtension) {
      console.log('File rejected:', file.originalname); // Debug log
      return cb(new Error(`Only image files (${allowedExtensions.join(', ')}) are allowed!`), false);
    }
    
    console.log('File accepted:', file.originalname); // Debug log
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.post("/upload", upload.array("documents", 5), (req, res) => {
  try {
    console.log("Upload request received:", req.files); // Debug log
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: 0, message: "No files uploaded" });
    }
    
    const fileUrls = req.files.map(file => {
      const filename = file.filename;
      const fileUrl = `https://online-auction-platform-1.onrender.com/uploads/${filename}`;
      console.log("Generated file URL:", fileUrl); // Debug log
      return fileUrl;
    });
    
    console.log("Generated file URLs:", fileUrls); // Debug log
    
    res.status(200).json({
      success: 1,
      fileUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      success: 0, 
      message: "Image upload failed",
      error: error.message 
    });
  }
});

// Route to Post an Auction
app.post('/postAuction', authenticateToken, async (req, res) => {
  try {
    console.log('Received auction data:', req.body); // Debug log
    const { itemName, sellerName, sellerEmail, category, description, startingBid, endTime, documents } = req.body;

    // Validation
    if (!itemName || !sellerName || !sellerEmail || !category || !description || !startingBid || !endTime) {
      console.log('Missing required fields:', { itemName, sellerName, sellerEmail, category, description, startingBid, endTime });
      return res.status(400).json({ 
        success: 0, 
        message: "All fields are required",
        receivedData: req.body 
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email: sellerEmail });
    if (!user) {
      console.log('User not found:', sellerEmail);
      return res.status(401).json({ 
        success: 0, 
        message: "Please login to post an auction",
        receivedData: req.body 
      });
    }

    // Validate documents (images)
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      console.log('No images provided');
      return res.status(400).json({ 
        success: 0, 
        message: "At least one image is required",
        receivedData: req.body 
      });
    }

    // Create a new auction
    const auction = new Auction({
      itemName,
      sellerName,
      sellerEmail,
      category,
      description,
      startingBid: Number(startingBid),
      endTime: new Date(endTime),
      images: documents // These should be full URLs from the upload endpoint
    });

    console.log('Creating auction:', auction); // Debug log
    await auction.save();
    console.log('Auction saved successfully:', auction._id); // Debug log

    res.status(201).json({ 
      success: 1, 
      message: "Auction posted successfully", 
      auction 
    });
  } catch (error) {
    console.error("Post auction error:", error);
    res.status(500).json({ 
      success: 0, 
      message: "Server error while posting auction",
      error: error.message 
    });
  }
});

// Add this constant at the top of the file, after the imports
const DEFAULT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDItMTNUMTU6NDc6NDctMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDItMTNUMTU6NDc6NDctMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAyLTEzVDE1OjQ3OjQ3LTA1OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5YjM5ZjM5LTM4ZTAtNDZiZC1hMzA1LTNkYzM5ZjM5M2QzYyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjQ5YjM5ZjM5LTM4ZTAtNDZiZC1hMzA1LTNkYzM5ZjM5M2QzYyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ5YjM5ZjM5LTM4ZTAtNDZiZC1hMzA1LTNkYzM5ZjM5M2QzYyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5YjM5ZjM5LTM4ZTAtNDZiZC1hMzA1LTNkYzM5ZjM5M2QzYyIgc3RFdnQ6d2hlbj0iMjAyNC0wMi0xM1QxNTo0Nzo0Ny0wNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+';

// Route to Fetch All Auctions
app.get('/api/auctions', async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = {};
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    let sortOption = {};
    if (sort === 'Price: Low to High') sortOption.startingBid = 1;
    if (sort === 'Price: High to Low') sortOption.startingBid = -1;
    if (sort === 'Ending Soon') sortOption.endTime = 1;
    
    const auctions = await Auction.find(query).sort(sortOption);
    console.log('Found auctions:', auctions.length); // Debug log
    
    // Format the auctions with proper image URLs
    const formattedAuctions = auctions.map(auction => {
      const auctionObj = auction.toObject();
      console.log('Processing auction:', auctionObj._id); // Debug log
      console.log('Original images:', auctionObj.images); // Debug log
      
      // Ensure images array exists and has at least one image
      if (!auctionObj.images || !Array.isArray(auctionObj.images) || auctionObj.images.length === 0) {
        console.log('No images found for auction:', auctionObj._id); // Debug log
        auctionObj.images = [DEFAULT_IMAGE];
      } else {
        // Ensure all image URLs are absolute
        auctionObj.images = auctionObj.images.map(img => {
          if (img.startsWith('http')) {
            console.log('Using existing absolute URL:', img); // Debug log
            return img;
          }
          if (img.startsWith('data:')) {
            console.log('Using data URL:', img); // Debug log
            return img;
          }
          const imageUrl = `https://online-auction-platform-1.onrender.com/uploads/${img}`;
          console.log('Created image URL:', imageUrl); // Debug log
          return imageUrl;
        });
      }
      console.log('Final formatted images:', auctionObj.images); // Debug log
      return auctionObj;
    });
    
    res.json(formattedAuctions);
  } catch (error) {
    console.error('Fetch auctions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to Get a Single Auction
app.get('/api/auctions/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Get all bids for this auction
    const bids = await Bid.find({ auctionId: req.params.id }).sort({ amount: -1 });
    
    // Calculate time left
    const now = new Date();
    const end = new Date(auction.endTime);
    const timeLeft = end - now;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const formattedTimeLeft = `${days}d ${hours}h`;

    // Format the response
    const formattedAuction = {
      ...auction.toObject(),
      bids,
      timeLeft: formattedTimeLeft,
      currentBid: auction.raisedAmount || auction.startingBid,
      minBidIncrement: 500 // Fixed increment for now
    };

    // Ensure images array exists and has at least one image
    if (!formattedAuction.images || !Array.isArray(formattedAuction.images) || formattedAuction.images.length === 0) {
      formattedAuction.images = ['https://via.placeholder.com/300x200?text=No+Image'];
    } else {
      // Ensure all image URLs are absolute
      formattedAuction.images = formattedAuction.images.map(img => {
        if (img.startsWith('http')) return img;
        return `https://online-auction-platform-1.onrender.com/uploads/${img}`;
      });
    }

    res.json(formattedAuction);
  } catch (error) {
    console.error('Fetch auction error:', error);
    res.status(500).json({ message: 'Server error while fetching auction details' });
  }
});

// Route to place a bid
app.post('/api/auctions/:auctionId/bid', authenticateToken, async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { amount, isAutoBid, maxAutoBidAmount } = req.body;

    // Get the auction
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if auction has ended
    if (new Date(auction.endTime) < new Date()) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Get the highest bid
    const highestBid = await Bid.findOne({ auctionId }).sort({ amount: -1 });
    const minBidAmount = highestBid ? highestBid.amount + 500 : auction.startingBid;

    // Validate bid amount
    if (amount < minBidAmount) {
      return res.status(400).json({ 
        message: `Bid must be at least $${minBidAmount}`,
        minBidAmount
      });
    }

    // Create new bid
    const bid = new Bid({
      auctionId,
      bidderId: req.user.userId,
      bidderName: req.user.name,
      bidderEmail: req.user.email,
      amount,
      isAutoBid,
      maxAutoBidAmount: isAutoBid ? maxAutoBidAmount : undefined
    });

    await bid.save();

    // Update auction's raised amount
    auction.raisedAmount = amount;
    await auction.save();

    res.status(201).json({
      message: 'Bid placed successfully',
      bid,
      auction: {
        currentBid: amount,
        timeLeft: auction.endTime
      }
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Server error while placing bid' });
  }
});

// Route to get auction details with bids
app.get('/api/auctions/:auctionId', async (req, res) => {
  try {
    const { auctionId } = req.params;
    
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Get all bids for this auction
    const bids = await Bid.find({ auctionId }).sort({ amount: -1 });
    
    // Calculate time left
    const now = new Date();
    const end = new Date(auction.endTime);
    const timeLeft = end - now;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const formattedTimeLeft = `${days}d ${hours}h`;

    res.json({
      ...auction.toObject(),
      bids,
      timeLeft: formattedTimeLeft,
      currentBid: auction.raisedAmount || auction.startingBid,
      minBidIncrement: 500 // You can make this dynamic based on the current bid
    });
  } catch (error) {
    console.error('Get auction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===================== DASHBOARD ENDPOINT =====================
app.get('/api/user/dashboard', authenticateToken, async (req, res) => {
  try {
    // Fetch user profile
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user's auctions (as seller)
    const userAuctions = await Auction.find({ sellerEmail: user.email });

    // Fetch all auctions (for stats)
    const allAuctions = await Auction.find();

    // Calculate real auction stats
    const totalBidsPlaced = 67; // Placeholder: replace with actual bid count logic
    const auctionsWon = 12;    // Placeholder: replace with actual won auctions logic
    const activeAuctions = userAuctions.length;
    const totalSpent = "$45,320"; // Placeholder: replace with actual spent amount logic

    const auctionStats = {
      totalBidsPlaced,
      auctionsWon,
      activeAuctions,
      totalSpent
    };

    // Mock: Recent activity (replace with real logic as needed)
    const recentActivity = [
      {
        id: 1,
        item: "Vintage Rolex Submariner",
        action: "Placed bid",
        amount: "$15,500",
        time: "2 hours ago",
        status: "winning"
      },
      {
        id: 2,
        item: "Art Deco Painting",
        action: "Outbid",
        amount: "$12,300",
        time: "5 hours ago",
        status: "outbid"
      }
    ];

    // Mock: Revenue data
    const revenueData = [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 48000 },
      { month: 'Apr', revenue: 61000 },
      { month: 'May', revenue: 55000 },
      { month: 'Jun', revenue: 67000 },
    ];

    // Mock: Category data
    const categoryData = [
      { name: 'Watches', value: 35 },
      { name: 'Art', value: 25 },
      { name: 'Cars', value: 20 },
      { name: 'Jewelry', value: 15 },
      { name: 'Other', value: 5 },
    ];

    // Recent auctions (last 5)
    const recentAuctions = allAuctions.slice(-5).map(a => ({
      item: a.itemName,
      currentBid: a.raisedAmount || a.startingBid,
      bids: 23, // Placeholder
      timeLeft: '2d 5h', // Placeholder
      status: 'Active', // Placeholder
    }));

    res.json({
      userProfile: {
        name: user.name,
        email: user.email,
        joined: user.createdAt,
        avatar: "https://randomuser.me/api/portraits/men/1.jpg", // Placeholder
        verificationStatus: "Verified", // Placeholder
        location: user.location
      },
      auctionStats,
      recentActivity,
      revenueData,
      categoryData,
      recentAuctions
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===================== UPDATE USER PROFILE ENDPOINT =====================
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, location } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.location = location || user.location;
    await user.save();

    // Return the complete user profile data in the same format as dashboard
    res.json({ 
      message: 'Profile updated successfully', 
      user: {
        name: user.name,
        email: user.email,
        location: user.location,
        joined: user.createdAt,
        avatar: "https://randomuser.me/api/portraits/men/1.jpg", // Placeholder
        verificationStatus: "Verified" // Placeholder
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
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
