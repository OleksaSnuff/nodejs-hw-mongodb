import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import checkEnvFor from './utils/env.js';
import { getAllContacts, getContactByID } from './services/contacts.js';
import mongoose from 'mongoose';

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

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: res.statusCode,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  // app.delete('/contacts/:contactId', async (req, res) => {
  //   const contactId = req.params.contactId;
  //   try {
  //     await deleteContactByID(contactId);

  //     res.status(200).json({
  //       message: `Successfully deleted contact with id ${contactId}!`,
  //     });
  //   } catch (error) {
  //     res.status(404).json({
  //       message: `Not found contact with id ${contactId}!!`,
  //     });
  //   }
  // });

  app.get('/contacts/:contactId', async (req, res) => {
    const contactId = req.params.contactId;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(404).json({
        status: res.statusCode,
        message: `Not valid id format ${contactId}!`,
      });
    }
    try {
      const contact = await getContactByID(contactId);

      if (!contact) {
        return res.status(404).json({
          status: res.statusCode,
          message: `Not found contact with id ${contactId}!`,
        });
      }
      res.status(200).json({
        status: res.statusCode,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        status: res.statusCode,
        message: `Server error`,
      });
    }
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
