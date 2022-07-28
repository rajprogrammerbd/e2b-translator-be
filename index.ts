require('express-async-errors');
require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import Database from "./src/config/db.config";
import homepageRoutes from './src/routes/homepage.route';
import userCredential from './src/routes/userCredential.route';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import passport from 'passport';
import colors from 'colors';

// Check for database connection.
Database.connect().then(() => {
  console.log(colors.italic.bold.bgGreen('Database is connected'));
}).catch(() => {
  console.log(colors.bold.bgRed('error on connect to database'));
  process.exit();
});

const app: express.Application = express();

app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

app.use(expressWinston.logger(loggerOptions));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(passport.initialize());
require("./src/config/passport.config");

app.use('/', homepageRoutes);
app.use('/auth', userCredential);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
});

// "dev": "tsc && node --unhandled-rejections=strict ./dist/index.js"
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Application is running on ${PORT}`));
