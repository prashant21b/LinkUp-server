import express from 'express';
import { requireSingIn } from '../middleware/auth';
import { getAllMessage, sendMessage } from '../controllers/chat';
const router=express.Router();


router.get('/get-message/:_id',requireSingIn,getAllMessage)
router.post('/send-message',requireSingIn,sendMessage)

module.exports=router;