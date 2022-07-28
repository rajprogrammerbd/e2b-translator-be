import express from 'express';
import passport from 'passport';
const router = express.Router();
import userCredential from '../controllers/userCredential.controllers';

router.post('/create', userCredential.saveUser);

router.get('/demo', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user);
})

router.post('/login', userCredential.loginUser);

export default router;
