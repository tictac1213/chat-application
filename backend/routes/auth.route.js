import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { Router } from 'express';

const router = Router();

router.post('/sign-up', registerUser);

router.post('/log-in', loginUser);

export default router;