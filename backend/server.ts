import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import contactsRouter from './routes/contacts';
import messagesRouter from './routes/messages';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sms-hub-connect';

app.use(cors());
app.use(express.json());

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

app.use('/api/contacts', contactsRouter);
app.use('/api/messages', messagesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
