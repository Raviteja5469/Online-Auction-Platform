// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));

// // Routes (we'll define these later)
// app.use('/api/auth', require('./routes/authRoutes'));
// // app.use('/api/auctions', require('./routes/auctionRoutes'));
// // app.use('/api/users', require('./routes/userRoutes'));

// // Database connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auction-app')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/auction-DB');

// Auction Schema matching your frontend expectations
const auctionItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    currentBid: { type: Number, required: true },
    highestBidder: { type: String, default: null },
    status: { type: String, default: 'active' }
});

const AuctionItem = mongoose.model('AuctionItem', auctionItemSchema);

// Get all auctions - matches your frontend fetch
app.get('/auctions', async (req, res) => {
    try {
        const auctions = await AuctionItem.find();
        res.json(auctions);
    } catch (error) {
        console.error('Error fetching auctions:', error);
        res.status(500).json({ message: 'Error fetching auctions' });
    }
});

// Get single auction - matches your frontend fetch
app.get('/auctions/:id', async (req, res) => {
    try {
        const auction = await AuctionItem.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        console.error('Error fetching auction:', error);
        res.status(500).json({ message: 'Error fetching auction item' });
    }
});

// Place bid - matches your frontend bid submission
app.post('/bid/:id', async (req, res) => {
    try {
        const { bid, username } = req.body;
        const auction = await AuctionItem.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        if (bid <= auction.currentBid) {
            return res.status(400).json({ message: 'Bid must be higher than current bid' });
        }

        auction.currentBid = bid;
        auction.highestBidder = username;
        await auction.save();

        res.json({
            message: 'Bid placed successfully',
            currentBid: auction.currentBid,
            highestBidder: auction.highestBidder
        });

    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ message: 'Error placing bid' });
    }
});

// Create new auction
app.post('/auctions', async (req, res) => {
    try {
        const { itemName, description, startingBid } = req.body;
        
        const newAuction = new AuctionItem({
            itemName,
            description,
            currentBid: startingBid
        });

        await newAuction.save();
        res.status(201).json(newAuction);
    } catch (error) {
        console.error('Error creating auction:', error);
        res.status(500).json({ message: 'Error creating auction' });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
