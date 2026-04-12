import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import jwtToken from "../utils/jwt.token.js";
import bcrypt from "bcryptjs";

//creating user Registration Controller ***
// @access Public
export const signup = asyncHandler(async (req, res) => {
  // reading request body and extracting secretKey
  // Secretkey is only required to give Admin role to the User
  // defualt role without SecretKet : player
  const { fullName, password, email, secretKey } = req.body;

  //Ensure all required fields are filled
  if (!fullName || !password || !email) {
    res.status(400);
    throw new Error("please fill all the required fields");
  }
  // check password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("password must be at least 6 character");
  }
  // check Email correct format using Regex
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("email format is not correct");
  }
  // check if User already exist
  const userIsExisting = await User.findOne({ email });
  if (userIsExisting) {
    res.status(400);
    throw new Error("email already used");
  }
  // check if the SecretKey is correct and match  the .env variable
  //if it matches ,the User become Admin , otherwise they are always "Player"
  const role = secretKey === process.env.ADMIN_SECRET_KEY ? "admin" : "player";

  //create the User in MongoDb
  const user = await User.create({
    fullName,
    email,
    password,
    role: role || "player",
  });

  // send back User data with JWT Token
  if (user) {
    res.status(201).json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      token: jwtToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("invalid User data");
  }
});

//  Login controller *****
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //checking if email is correct
  if (!email || !password) {
    res.status(400);
    throw new Error("please fill all required fields");
  }

  const user = await User.findOne({ email }); // check if email is exist

  if (user && (await bcrypt.compare(password, user.password))) {
    // checking if password is correct
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: jwtToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("email or password is not correct");
  }
});

//Get current logged-in user data *****
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

//Get all players in the ticket-system ,"only authorized by admin" ****
export const getAllPlayers = asyncHandler(async (req, res) => {
  //check if the the user has "admin" role
  if (req.user.role.toString() === "admin") {
    const players = await User.find({ role: "player" });
    return res.status(200).json(players);
  }
  res.status(401);
  throw new Error("not Authorized");
});
// Delete User controller *****
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // check if user exists
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // checking if user want to delete own account or with Admin Role
  if (req.user.id.toString() !== req.params.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized to delete this account");
  }
  await user.deleteOne();
  // return success message
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: user,
  });
});
