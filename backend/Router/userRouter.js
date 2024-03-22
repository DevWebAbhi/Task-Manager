const express = require("express");

const userModel = require("../Model/userModel");

const jwt = require('jsonwebtoken');

const sendVerificationEmail = require("../mailer");

const bcrypt = require('bcrypt');

const saltRounds = 5;

const emailCheck = require('node-email-check');

const JWT_PASSWORD = process.env.JWT_PASSWORD;

const userRouter = express.Router();

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
     try {
        
        const check = await userModel.findOne({email});
        if(check.verified){
            const match = await bcrypt.compare(password, check.password);
        if(check && match){
        const token = jwt.sign({ userId:check.id }, JWT_PASSWORD);
        return res.status(200).send({message:"successfull",token:token,userName:check.userName});
        }else{
            return res.status(401).send({message:"unauthorized access"});
        }
        }else{
            if(check){
                return res.status(200).send({message:"process"}); 
            }
            else{
                return res.status(401).send({message:"unauthorized access"});
            }
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
                userName,email,password:hash,verified:false
            });
            await setUser.save();
            await sendVerificationEmail(setUser.email);
            return res.status(200).send({message:"successfull"});
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

