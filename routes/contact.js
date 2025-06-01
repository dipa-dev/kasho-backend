const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const result = await resend.emails.send({
      from: 'Contact Form <your@resend.dev>',
      to: 'divyapandey1870@gmail.com',
      subject: `New Contact Us Message from ${name}`,
      reply_to: email,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ message: 'Message sent successfully!', result });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send message.', error: error.message });
  }
});

module.exports = router;
