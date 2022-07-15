require('express-async-errors');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Database = require("./src/config/db.config");
const homepageRoutes = require('./src/routes/homepage.route');
const userCredential = require('./src/routes/userCredential.route');
const passport = require('passport');

// Check for database connection.
Database.connect().then(() => {
  console.log('Database is connected');
}).catch((err) => {
  console.log('error on connect to database');
  process.exit();
});

const app = express();

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

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Application is running on ${PORT}`));
