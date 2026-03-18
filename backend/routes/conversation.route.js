import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { searchConversation, createConversation, getUserConversations } from '../controllers/conversation.controller.js';


const router = Router();

router.post('/', authMiddleware, createConversation);

router.get('/', authMiddleware, searchConversation);

router.get('/me', authMiddleware, getUserConversations);


export default router;