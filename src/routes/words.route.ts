import express from 'express';
const router = express.Router();
import wordsControllers from "../controllers/words.controllers";

router.post('/add-word', wordsControllers.addWords);

router.delete('/delete-word', wordsControllers.deleteWords)

export default router;
