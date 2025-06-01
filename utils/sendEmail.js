const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOutOfStockAlert = async (product) => {
  try {
    await resend.emails.send({
      from: 'Your Store <your@resend.dev>',
      to: 'divyapandey1870@gmail.com', 
      subject: `Product Out of Stock: ${product.productName}`,
      html: `
        <h2>Product Out of Stock</h2>
        <p><strong>Product:</strong> ${product.productName}</p>
        <p><strong>ID:</strong> ${product._id}</p>
        <p><strong>Current Qty:</strong> 0</p>
      `
    });
    console.log(`Out of stock alert sent for: ${product.productName}`);
  } catch (err) {
    console.error('Failed to send out of stock email:', err.message);
  }
};

module.exports = { sendOutOfStockAlert };
