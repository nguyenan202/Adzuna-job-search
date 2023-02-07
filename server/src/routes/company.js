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
    updateStatus,
    updateInfo,
    updateImage,
    removeImage,
    addAddress
} from '../controllers/company'

const router = express.Router();


router.get('/:userId', verifyToken, getCompanyByUserId);
router.get('/history/:userId', verifyToken, getHistorySignByUserId);
router.get('/request/all',verifyTokenAdmin, getAllRequestCompany);

router.post('/', verifyToken, signCompany);
router.post('/address', verifyToken, addAddress);

router.patch('/', verifyTokenAdmin, updateStatus);
router.patch('/infomation', verifyToken, updateInfo);
router.patch('/image', verifyToken, updateImage);

router.delete('/image', verifyToken, removeImage);

export default router;