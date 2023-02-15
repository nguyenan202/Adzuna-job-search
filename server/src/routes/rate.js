import express from 'express';
import { verifyToken } from '../middlewares/auth';
import {
    createRate,
} from '../controllers/rate';

const router = express.Router();


router.post('/', verifyToken, createRate);


export default router;