import { OAuth2Client } from 'google-auth-library';
import checkEnvFor from './env.js';
import createHttpError from 'http-errors';
import { ENV_VARS } from '../constants/index.js';

const googleOAuthClient = new OAuth2Client({
  clientId: checkEnvFor(ENV_VARS.GOOGLE_AUTH_CLIENT_ID),
  clientSecret: checkEnvFor(ENV_VARS.GOOGLE_AUTH_CLIENT_SECRET),
  redirectUri: checkEnvFor('REDIRECT_URIS'),
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';

  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};
