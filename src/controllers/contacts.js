import mongoose from 'mongoose';
import {
  createContact,
  deleteContactByID,
  getAllContacts,
  getContactByID,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: res.statusCode,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIDController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      status: res.statusCode,
      message: `Not valid id format ${contactId}!`,
    });
  }

  const contact = await getContactByID(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(200).json({
    status: res.statusCode,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: res.statusCode,
    message: 'Successfully created a student!',
    data: newContact,
  });
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body, { upsert: true });

  if (!result) next(createHttpError(404, 'Contact not found'));

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { contact } = await updateContact(contactId, req.body);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(200).json({
    status: res.statusCode,
    message: 'Successfully patched a contact!',
    contact,
  });
};

export const deleteContactByIDController = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      status: res.statusCode,
      message: `Contact not found ${contactId}!`,
    });
  }

  await deleteContactByID(contactId);
  res.status(204).send();
};
