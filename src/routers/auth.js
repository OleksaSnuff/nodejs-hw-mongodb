import { Router } from 'express';
import { validateBody } from '../middleware/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
} from '../controllers/auth.js';
import { userLoginSchema, userValidationSchema } from '../validation/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(userValidationSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(userLoginSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshTokenController));

export default router;
