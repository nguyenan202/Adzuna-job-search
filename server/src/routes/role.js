import express from 'express'

import {
    verifyToken,
    verifyTokenAdmin
} from '../middlewares/auth';

import {
    createRole,
    getAllRole,
    updateRole
} from '../controllers/role';

const router = express.Router();

router.get('/', verifyToken, getAllRole);

router.post('/', verifyToken, createRole);

router.patch('/', verifyTokenAdmin, updateRole);

export default router;