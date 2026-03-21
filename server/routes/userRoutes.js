import express from 'express';
import { signup } from '../controller/userController.js';

const router= express.Router();
// signup post request to /api/auth/user/signup
router.post('/signup',signup);
export default router