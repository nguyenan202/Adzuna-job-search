import express from 'express';
import { verifyToken } from '../middlewares/auth';
import {
    getAllPostInCurrentMonth,
    createPost,
    getAllPostByCompanyId,
    getAllPost,
    updateStatusPost,
    getAllPostActive,
    getAllPostActiveWithSearch,
    getPostById,
    changeDatePost
} from '../controllers/post';

const router = express.Router();

router.get('/company/:companyId', verifyToken, getAllPostByCompanyId);
router.get('/current-month/:id', verifyToken, getAllPostInCurrentMonth);
router.get('/', verifyToken, getAllPost);
router.get('/id/:id', verifyToken, getPostById);
router.get('/active', verifyToken, getAllPostActive);
router.get('/all/:name', verifyToken, getAllPostActiveWithSearch);

router.post('/', verifyToken, createPost);
router.post('/status', verifyToken, updateStatusPost);

router.patch('/', verifyToken, changeDatePost);

export default router;