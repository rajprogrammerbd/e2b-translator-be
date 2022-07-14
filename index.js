require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Database = require("./src/config/db.config");
const homepageRoutes = require('./src/routes/homepage.route');

// Check for database connection.
Database.connect().catch(() => process.exit());

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use('/', homepageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Application is running on ${PORT}`));
