import { createTransport } from 'nodemailer';
import { SMTP } from '../constants/index.js';
import checkEnvFor from './env.js';

const transporter = createTransport({
  host: checkEnvFor(SMTP.SMTP_HOST),
  port: Number(checkEnvFor(SMTP.SMTP_PORT)),
  auth: {
    user: checkEnvFor(SMTP.SMTP_USER),
    pass: checkEnvFor(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => await transporter.sendMail(options);
