const express = require('express');
const passport = require('passport');
const router = express.Router();
const userCredential = require('../controllers/userCredential.controllers');

router.post('/create', userCredential.saveUser);

router.get('/demo', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user);
})

router.post('/login', userCredential.loginUser);

module.exports = router;
