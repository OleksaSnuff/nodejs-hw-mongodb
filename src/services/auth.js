import createHttpError from 'http-errors';
import { usersModel } from '../db/user.js';
import bcrypt from 'bcrypt';
import { sessionModel } from '../db/session.js';
import {
  FIFTEEN_MINUTES,
  SMTP,
  TEMPLATES_DIR,
  THIRTY_DAYS,
} from '../constants/index.js';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import checkEnvFor from '../utils/env.js';
import { sendEmail } from '../utils/sendEmail.js';
import path from 'path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

export const registerUser = async (payload) => {
  const user = await usersModel.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await usersModel.create({ ...payload, password: encryptedPassword });
};

export const loginUser = async (payload) => {
  const user = await usersModel.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found!');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await sessionModel.deleteOne({ userId: user._id });

  const session = createSession();

  return await sessionModel.create({
    userId: user._id,
    ...session,
  });
};

export const logoutUser = async (sessionId) => {
  await sessionModel.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUserToken = async ({ sessionId, refreshToken }) => {
  const session = await sessionModel.findOne({ _id: sessionId, refreshToken });

  if (!session) throw createHttpError(401, 'Session not found!');

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isRefreshTokenExpired)
    throw createHttpError(401, 'Session token expired!');

  const newSession = createSession();

  await sessionModel.deleteOne({ _id: sessionId, refreshToken });

  return await sessionModel.create({ userId: session.userId, ...newSession });
};

export const requestResetToken = async (email) => {
  const user = await usersModel.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found!');

  const resetToken = jwt.sign(
    { sub: user._id, email },
    checkEnvFor('JWT_SECRET'),
    { expiresIn: '5m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${checkEnvFor(
      'APP_DOMAIN',
    )}/auth/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: checkEnvFor(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    throw err;
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = await jwt.verify(payload.token, checkEnvFor('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await usersModel.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) throw createHttpError(404, 'User not found!');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await usersModel.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await sessionModel.deleteOne({ _id: user._id });
};
