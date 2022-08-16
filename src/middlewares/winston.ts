import 'winston-mongodb';
import * as winston from 'winston';

const options = {
    db: process.env.MONGODB_ACCESS_URL as string,
    collection: 'e2b-translator-error',
    level: 'error',
    options: {
        useUnifiedTopology: true
    }
};

export const logger = winston.createLogger({
    level: 'error',
    format: winston.format.simple(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.MongoDB(options)
    ],
  });