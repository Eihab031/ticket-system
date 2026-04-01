import express from 'express';
import { deleteUser, getAllPlayers, getMe, login, logout, signup } from '../controller/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router= express.Router();

// signup post request to /api/auth/user/signup
router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.get('/me',protect,getMe);
router.get("/players",protect,getAllPlayers)
router.delete('/:id',protect,deleteUser)
export default router