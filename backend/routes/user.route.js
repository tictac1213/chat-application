import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { getUser, searchUser } from "../controllers/user.controller.js";


const router = Router();

router.get('/me', authMiddleware, getUser);

router.get('/search', authMiddleware, searchUser);

export default router;