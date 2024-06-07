import { contactsModel } from '../db/Contact/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
};

export const getContactByID = async (contactId) => {
  const contact = await contactsModel.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const newContact = await contactsModel.create(payload);
  return newContact;
};

export const updateContact = async (contactID, payload, options = {}) => {
  const rawResult = await contactsModel.findOneAndUpdate(
    { _id: contactID },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContactByID = async (contactId) => {
  const contact = await contactsModel.findOneAndDelete({ _id: contactId });
  return contact;
};
