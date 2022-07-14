const express = require('express');
const router = express.Router();
const homepageControllers = require("../controllers/homepage.controllers");

router.get('/', homepageControllers.defaultHome);

module.exports = router;