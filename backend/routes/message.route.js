import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getConversationMessages, sendMessage } from '../controllers/message.controller.js';

const router = Router();

// send msg
router.post('/send-message', authMiddleware, sendMessage);
router.get('/conversation/:conversationId/messages', authMiddleware, getConversationMessages);



export default router;