const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const productRout = require("./routes/products");
const orderRoutes = require("./routes/orderRoutes");
require('./models/product');
require('./models/order');
dotenv.config();
connectDB();

const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoutes);
app.use("/api",productRout);

app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});