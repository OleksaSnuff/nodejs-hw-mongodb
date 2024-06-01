import { contactsModel } from '../db/Contact/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
};

export const getContactByID = async (contactId) => {
  const contact = await contactsModel.findById(contactId);
  return contact;
};
