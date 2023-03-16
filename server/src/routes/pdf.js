import express from "express";
import { verifyToken } from "../middlewares/auth";
import { extractPDF } from "../controllers/pdf";

const router = express.Router();

router.post('/', verifyToken, extractPDF);


export default router;