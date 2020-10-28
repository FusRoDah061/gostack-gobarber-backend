import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import logging from '@config/logging';
import rateLimiter from './middlewares/rateLimiter';
import '@shared/infra/typeorm';
import '@shared/container';

const app = express();
const logger = logging.createLogger('server');

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    logger.error(err);

    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  logger.info(`Running on ${port} ...`);
});
