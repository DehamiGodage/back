import express from 'express';
import {createUser, loginUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login",loginUser)
console.log("Login route registered");

export default userRouter; // only one default for each file