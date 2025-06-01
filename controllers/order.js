const Order = require("../models/order");
const Product = require('../models/product');
require('../models/product');
const { sendOutOfStockAlert } = require('../utils/sendEmail');

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = req.body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Validate products and update quantities
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.qty < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.productName}` });
      }

      // Deduct stock
      product.qty -= item.quantity;
      product.inStock = product.qty > 0;
      await product.save();
      if (product.qty === 0) {
        await sendOutOfStockAlert(product);
      }
    }

    // Create order with full item details for historical tracking
    const detailedItems = await Promise.all(
      items.map(async item => {
        const product = await Product.findById(item.productId);
        return {
          productId: product._id,
          productName: product.productName,
          imageUrl: product.imageUrl,
          sellingPrice: product.sellingPrice,
          qty: item.quantity
        };
      })
    );

    const totalAmount = detailedItems.reduce((acc, item) => acc + item.sellingPrice * item.qty, 0);

    const order = new Order({
      userId,
      items: detailedItems,
      totalAmount
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).populate("items.productId");

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
