const Database = require("./src/config/db.config");

Database.connect().then((obj) => console.log('database is successfully connected.', obj)).catch((err) => console.log('failed to connect with the database', err));