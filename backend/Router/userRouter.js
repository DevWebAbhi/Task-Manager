const express = require("express");

const userModel = require("../Model/userModel");

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const saltRounds = 5;

const emailCheck = require('node-email-check');

const JWT_PASSWORD = process.env.JWT_PASSWORD;

const userRouter = express.Router();

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
     try {
        const check = await userModel.findOne({email,password});
        if(check){
        const token = jwt.sign({ userId:check.id }, JWT_PASSWORD);
        return res.status(200).send({message:"sucess",token:token});
        }else{
            return res.status(401).send({message:"unauthorized access"});
        }
    } catch (error) {
        return res.status(500).send({message:"internal server error"});
    }
})

userRouter.post("/signup",async(req,res)=>{
    const {userName,email,password} = req.body;
    try {
        const check = await userModel.findOne({userName,email});
        if(!check){
        const isValidEmail = await emailCheck.isValid(email);
        if(isValidEmail){
            const hash = bcrypt.hashSync(password, saltRounds);
            const setUser = await userModel({
                userName,email,password:hash
            });
            await setUser.save();
            const token =jwt.sign({ userId:setUser.id }, JWT_PASSWORD);
            return res.status(200).send({message:"sucess",token:token});
        }else{
            return res.status(401).send({message:"invalid email"});
        }
    }else{
        return res.status(409).send({message:"already registered"});
    }
    } catch (error) {
        return res.status(500).send({message:"internal server error"});
    }
})

module.exports = userRouter;

