import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import asyncHandler from 'express-async-handler';

// protect function to check all logged-in Users
export const protect = asyncHandler(async (req,res,next) => {
    let token;
    
    //check if the Authourization header exist and start with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
        //extracting token from the string
        token= req.headers.authorization.split(' ')[1];
        // verify token 
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        //find the user in dataBase
        req.user= await User.findById(decoded.id).select('-password');
        next();

    } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('not Authourized,token failed or expired')
    }        
    }
    if(!token){
        res.status(401);
        throw new Error('not authorized,no token provided');
    }
});