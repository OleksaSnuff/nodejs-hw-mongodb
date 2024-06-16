import Joi from 'joi';

const messages = {
  name: {
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
  },
  phoneNumber: {
    'string.base': 'Phone number should be a string',
  },
  email: {
    'string.base': 'Email should be a string',
    'string.email': 'Email must be a valid email address',
  },
  isFavourite: {
    'boolean.base': 'Favourite status should be a boolean',
  },
  contactType: {
    'string.base': 'Contact type should be a string',
    'any.only': 'Contact type must be one of [work, home, personal]',
  },
};

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages(messages.name),
  phoneNumber: Joi.string().messages(messages.phoneNumber),
  email: Joi.string().email().messages(messages.email),
  isFavourite: Joi.boolean().default(false).messages(messages.isFavourite),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .messages(messages.contactType),
});
