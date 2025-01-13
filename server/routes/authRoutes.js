const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//Route for registering user
router.post("/register",async (req,res) => {
    const {username,email,password} = req.body;
    try {
        // Check if the user already exists
        const userExists  = await User.findOne({email});
        
        if(userExists){
            return res.status(400).json({message:"User Already Exists"});
        }
        //Create new user
        const newUser = new User({username,email,password});
        await newUser.save();
        res.status(201).json({message:"User registered successfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

//Route for login user
router.post("/login",async (req,res) => {
    const {email,password} = req.body;
    try {
        // Find user by email
        const user  = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        //Check password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        //Generate JWT
        const token = jwt.sign({id:user._id},JWT_SECRET_KEY,{expiresIn:"1h"});
        res.status(200).json({message:"Successfully Logged In",token});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});



module.exports = router;