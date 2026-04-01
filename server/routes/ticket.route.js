import express from 'express'
import {getTickets,createTicket,getTicket, deleteTicket} from '../controller/ticket.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router= express.Router();
router.get('/',protect,getTickets);
router.get('/:id',protect,getTicket);
router.post('/',protect,createTicket);
router.delete('/:id',protect,deleteTicket)
export default router;