import Joi from 'joi';

const messages = {
  name: {
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  },
  phoneNumber: {
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
    'any.required': 'Phone number is required',
  },
  email: {
    'string.base': 'Email should be a string',
    'string.email': 'Email must be a valid email address',
    'string.min': 'Email should have at least {#limit} characters',
    'string.max': 'Email should have at most {#limit} characters',
    'any.required': 'Email is required',
  },
  isFavourite: {
    'boolean.base': 'Favourite status should be a boolean',
  },
  contactType: {
    'string.base': 'Contact type should be a string',
    'string.min': 'Contact should have at least {#limit} characters',
    'string.max': 'Contact should have at most {#limit} characters',
    'any.only': 'Contact type must be one of [work, home, personal]',
  },
};

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages(messages.name).required(),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .messages(messages.phoneNumber)
    .required(),
  email: Joi.string().min(3).max(20).email().messages(messages.email),
  isFavourite: Joi.boolean().default(false).messages(messages.isFavourite),
  contactType: Joi.string()
    .min(4)
    .max(8)
    .valid('work', 'home', 'personal')
    .default('personal')
    .messages(messages.contactType),
});
