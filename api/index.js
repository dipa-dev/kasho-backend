// api/index.js
const express = require('express');
const serverless = require('serverless-http');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const authRoutes = require("../routes/authRoutes");
const productRout = require("../routes/products");
const orderRoutes = require("../routes/orderRoutes");
const contactRoute = require("../routes/contact");

require('../models/product');
require('../models/order');

dotenv.config();
connectDB();

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.status(200).json("API is working");
});

app.use("/api/auth", authRoutes);
app.use("/api", productRout);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoute);

// 👇 Export Express app as a handler for Vercel
module.exports = serverless(app);
