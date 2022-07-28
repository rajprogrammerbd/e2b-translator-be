import express from 'express';
const router = express.Router();
import homepageControllers from "../controllers/homepage.controllers";

router.get('/', homepageControllers.defaultHome);

export default router;
