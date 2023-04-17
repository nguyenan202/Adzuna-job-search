import express from 'express';
import { verifyToken } from '../middlewares/auth';
import { createTraffic, getAll } from '../controllers/traffic';

const router = express.Router();

router.get('/', verifyToken, getAll);

router.post('/', verifyToken, createTraffic);


export default router;