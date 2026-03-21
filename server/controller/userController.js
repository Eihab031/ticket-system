import asyncHandler from 'express-async-handler'
import User from '../models/User.model.js'
import jwtToken from '../utils/jwt.token.js'

//creating Registration Controller
// @access Public
export const signup= asyncHandler(async (req,res)=>{

    // reading request body and extracting secretKey
    // Secretkey is only required to give Admin role to the User
    // defualt role without SecretKet : player
    const {fullName,password,email,secretKey}= req.body;

    //Ensure all required fields are filled
    if (!fullName ||!password||!email){
         res.status(400);
        throw new Error("please fill all the required fields");
    }
    // check password length
    if (password.length<6) {
        res.status(400);
        throw new Error ("password must be at least 6 character");
    }
    // check Email correct format using Regex
    const emailRegex=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (! emailRegex.test(email)){
        res.status(400);
        throw new Error('email format is not correct');
    }
    // check if User already exist 
    const userIsExisting= await User.findOne({email});
    if (userIsExisting) {
        res.status(400);
        throw new Error("email already used");
    }
    // check if the SecretKey is correct and match  the .env variable
    //if it matches ,the User become Admin , otherwise they are always "Player"
    const role= secretKey=== process.env.ADMIN_SECRET_KEY?'admin':'player';

    //create the User in MongoDb 
    const user= User.create({
        fullName,
        email,
        password,
        role: role||'player' 

    });

    // send back User data with JWT Token
    if(user){
        res.status(201).json({
            _id:user.id,
            fullName:user.fullName,
            email:user.email,
            token:jwtToken(user._id),
            role:user.role
        })
    }
    else{
        res.status(400);
        throw new Error("invalid User data")
    }
})