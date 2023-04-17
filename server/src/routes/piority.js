import express from 'express';

import { verifyToken } from '../middlewares/auth';
import {
    getAllPiority
} from '../controllers/piority';

const router = express.Router();

router.get('/', verifyToken, getAllPiority);

export default router;