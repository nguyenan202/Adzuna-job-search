import express from 'express';

import {
    verifyToken,
    verifyTokenAdmin
} from '../middlewares/auth'
import {
    getCompanyByUserId,
    getHistorySignByUserId,
    signCompany,
    getAllRequestCompany,
    updateStatus
} from '../controllers/company'

const router = express.Router();


router.get('/:userId', verifyToken, getCompanyByUserId);
router.get('/history/:userId', verifyToken, getHistorySignByUserId);
router.get('/request/all',verifyTokenAdmin, getAllRequestCompany);

router.post('/', verifyToken, signCompany);

router.patch('/', verifyTokenAdmin, updateStatus);

export default router;