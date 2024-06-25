import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import checkEnvFor from './utils/env.js';
import rootRouter from './routers/index.js';
import notFoundMiddleware from './middleware/notFoundMiddleware.js';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
dotenv.config();

const setupServer = async () => {
  const PORT = checkEnvFor('PORT', 3000);

  const app = express();
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(rootRouter);

  app.use('*', notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
