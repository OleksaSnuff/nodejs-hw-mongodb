import { contactsModel } from '../db/Contact/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async (
  userId,
  {
    page = 1,
    perPage = 10,
    sortBy = '_id',
    sortOrder = SORT_ORDER.ASC,
    filter = {},
  },
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactsModel.find({ userId });

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsCount = await contactsModel
    .find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts, ...paginationData };
};

export const getContactByID = async (contactId, userId) => {
  const contact = await contactsModel.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload) => {
  const newContact = await contactsModel.create(payload);
  return newContact;
};

export const updateContact = async (contactId, payload, userId) => {
  const rawResult = await contactsModel.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContactByID = async (contactId, userId) => {
  const contact = await contactsModel.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
