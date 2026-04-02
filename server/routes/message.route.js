import express from 'express'
import protect from '../middleware/auth.middleware.js'
import { creatMessage, deleteMessage, getMessages } from '../controller/message.controller.js';

const router= express.Router({mergeParams:true});

router.post('/',protect,creatMessage);
router.get('/',protect,getMessages);
router.delete('/:messageId',protect,deleteMessage);

export default router;