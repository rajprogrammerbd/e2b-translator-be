import express from 'express';
const router = express.Router();
import wordsControllers from "../controllers/words.controllers";

router.post('/add-word', wordsControllers.addWords);

export default router;
