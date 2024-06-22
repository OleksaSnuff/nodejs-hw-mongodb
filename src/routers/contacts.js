import { Router } from 'express';
import {
  createContactController,
  deleteContactByIDController,
  getAllContactsController,
  getContactByIDController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middleware/validateBody.js';
import { createContactSchema } from '../validation/createContactSchema.js';
import { updateContactSchema } from '../validation/updateContactSchema.js';
import { isValidID } from '../utils/isValidID.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', isValidID, ctrlWrapper(getContactByIDController));

router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.put('/:contactId', isValidID, ctrlWrapper(upsertContactController));

router.patch(
  '/:contactId',
  isValidID,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

router.delete(
  '/:contactId',
  isValidID,
  ctrlWrapper(deleteContactByIDController),
);
export default router;
