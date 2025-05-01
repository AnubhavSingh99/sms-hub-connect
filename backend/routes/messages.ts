import express from 'express';
import Message from '../models/message';

const router = express.Router();

// Get all messages or filter by contactId
router.get('/', async (req, res) => {
  try {
    const contactId = req.query.contactId;
    let messages;
    if (contactId) {
      messages = await Message.find({ contactId }).sort({ time: 1 });
    } else {
      messages = await Message.find().sort({ time: 1 });
    }
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  const message = new Message({
    contactId: req.body.contactId,
    content: req.body.content,
    time: req.body.time || new Date(),
    incoming: req.body.incoming,
  });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
