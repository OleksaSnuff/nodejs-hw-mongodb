import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import checkEnvFor from './utils/env.js';
import { getAllContacts } from './services/contacts.js';

dotenv.config();

const setupServer = async () => {
  const PORT = checkEnvFor('PORT', 3000);

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.get('/', async (req, res) => {
    res.status(200).json({
      message: 'hello',
    });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      message: '200',
      data: contacts,
    });
  });

  app.get('/con', async (req, res) => {
    const students = await getAllContacts();

    res.status(200).json({
      message: 'sad',
      data: students,
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
