const express = require("express");
const router = express.Router();
const { placeOrder,getOrders } = require("../controllers/order");
const authenticateToken = require("../middlewares/auth");

router.post("/", authenticateToken, placeOrder);
router.get("/", authenticateToken, getOrders); 

module.exports = router;
