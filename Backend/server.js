const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const tenderRoutes = require('./routes/tenderRoutes');
const bidRoutes = require('./routes/bidRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/bids', bidRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server started succesfully');
})

app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

const dbConnect = require("./config/connection");
dbConnect();

