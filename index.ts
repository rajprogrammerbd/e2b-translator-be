require('./src/utils/newrelic');
require('express-async-errors');
require('dotenv').config();
import compression from 'compression';
import responseTime from 'response-time';
import express from 'express';
import bodyParser from 'body-parser';
import Database from "./src/config/db.config";
import homepageRoutes from './src/routes/homepage.route';
import userCredential from './src/routes/userCredential.route';
import wordsRoute from './src/routes/words.route';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import colors from 'colors';

// import middleware functions.
import isLogin from './src/middlewares/isLogin';
// import { logger } from './src/middlewares/winston';

process.on('uncaughtException', err => {
  console.log(`Uncaught Exception logged:`, err, err.stack);
});

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error, error);
});

// Check for database connection.
Database.connect().then(() => {
  console.log(colors.italic.bold.bgGreen('Database (MongoDB) is connected'));
});

const app: express.Application = express();
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(responseTime());

app.use(isLogin);

const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.use('/api', homepageRoutes);
app.use('/api/auth', userCredential);
app.use('/api/auth', wordsRoute);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({'message': err.message});
  
  return;
});

// "dev": "tsc && node --unhandled-rejections=strict ./dist/index.js"
const PORT = process.env.PORT || 5000;
export const appPort = app.listen(PORT, () => console.log(`Application is running on ${PORT}`));