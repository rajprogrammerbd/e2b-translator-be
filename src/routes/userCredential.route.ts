import express from 'express';
const router = express.Router();
import userCredential from '../controllers/userCredential.controllers';

router.post('/create', userCredential.saveUser);

router.delete('/delete', userCredential.deleteAUser);

router.post('/logout', userCredential.logoutUser);

router.post('/login', userCredential.loginUser);

export default router;
