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
    changeDatePost,
    getAllPostPending,
    updatePost,
    deletePostById
} from '../controllers/post';

const router = express.Router();

router.get('/company/:companyId', verifyToken, getAllPostByCompanyId);
router.get('/current-month/:id', verifyToken, getAllPostInCurrentMonth);
router.get('/', verifyToken, getAllPostPending);
router.get('/all', verifyToken, getAllPost);
router.get('/id/:id', verifyToken, getPostById);
router.get('/active', verifyToken, getAllPostActive);
router.get('/all/:name', verifyToken, getAllPostActiveWithSearch);

router.post('/', verifyToken, createPost);
router.post('/status', verifyToken, updateStatusPost);

router.put('/', verifyToken, updatePost);
router.patch('/', verifyToken, changeDatePost);

router.delete('/', verifyToken, deletePostById);

export default router;