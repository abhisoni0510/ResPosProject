import {Router} from 'express';
import { sample_users } from '../data';
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.model';

const router = Router();

router.post("/register", async (req, res) => {
  try {
      const { name, email, password, isAdmin } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User with this email already exists' });
      }
      const newUser = new UserModel({
          name,
          email,
          password,
          isAdmin
      });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
   
   router.post("/login", asyncHandler(
    async (req, res) => {
      const {email, password} = req.body;
      const user = await UserModel.findOne({email , password});
                                     
       if(user) {
        res.send(generateTokenReponse(user));
       }
       else{
        const BAD_REQUEST = 400;
        res.status(BAD_REQUEST).send("Username or password is invalid!");
       }
    }
   ))

  const generateTokenReponse = (user : any) => {
    const token = jwt.sign({
      email:user.email, isAdmin: user.isAdmin,name:user.name
    },"Difficulttomanagetheprimetimeuse",{
      expiresIn:"30d"
    });
    user.token = token;
    return user;
  }

  export default router;
