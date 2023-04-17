import express from 'express';

import {
    verifyToken
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
    addAddress,
    updateAddress,
    deleteAddress,
    getAllAddressByCompanyId,
    getCompanyByCompanyId,
    getAllTopCompany,
    getCompaniesByName,
    deleteCompanyById
} from '../controllers/company'

const router = express.Router();


router.get('/all', verifyToken, getAllTopCompany);
router.get('/name/:name', verifyToken, getCompaniesByName);
router.get('/:userId', verifyToken, getCompanyByUserId);
router.get('/id/:id', verifyToken, getCompanyByCompanyId);
router.get('/history/:userId', verifyToken, getHistorySignByUserId);
router.get('/request/all',verifyToken, getAllRequestCompany);
router.get('/address/:companyId', verifyToken, getAllAddressByCompanyId);

router.post('/', verifyToken, signCompany);
router.post('/address', verifyToken, addAddress);

router.patch('/', verifyToken, updateStatus);
router.patch('/infomation', verifyToken, updateInfo);
router.patch('/image', verifyToken, updateImage);
router.patch('/address', verifyToken, updateAddress)

router.delete('/', verifyToken, deleteCompanyById);
router.delete('/image', verifyToken, removeImage);
router.delete('/address', verifyToken, deleteAddress);

export default router;