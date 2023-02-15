import expess from 'express'

import { verifyToken } from '../middlewares/auth';
import {
    createWorkingTime,
    getAllWorkingTime,
    getWorkingTimeById,
    updateWorkingTimeById
} from '../controllers/workingTime';

const router = expess.Router();


router.get('/', verifyToken, getAllWorkingTime);
router.get('/:id', verifyToken, getWorkingTimeById);

router.post('/', verifyToken, createWorkingTime);

router.patch('/', verifyToken, updateWorkingTimeById);
export default router;