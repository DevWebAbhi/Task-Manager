const express = require("express");

const app=express();

app.use(express.json());

const dotenv=require("dotenv");

dotenv.config();

const jwt = require('jsonwebtoken');

const connect = require("./db");

const userRouter = require("./Router/userRouter");

const taskRouter = require("./Router/taskRouter");

const userModel = require("./Model/userModel");

// Enviroment variables 

const PORT = process.env.PORT;

const JWT_PASSWORD = process.env.JWT_PASSWORD;

app.get("/",(req,res)=>{
    res.status(200).send({message:"Welcome to Task Manage Backend"});
});

app.use("/user",userRouter);

app.use("/task",authentication,taskRouter);

// Authentication function

async function authentication(req,res,next){
     try {
        const token = req.headers.authorization.split(" ")[1];
        // Preventing the server from crashing if token is not avaliable
         if(token){
            const tokenDecoded = jwt.verify(token, JWT_PASSWORD);
            if(tokenDecoded.userId){
                const check = userModel.findOne({_id:tokenDecoded.userId});
                if(check){
                    req.body["id"]=tokenDecoded.userId;
                    next();
                }else{
                    return res.status(401).send({message:"unauthorized access"});
                }
            }else{
                return res.status(401).send({message:"unauthorized access"});
            }
         }else{
            return res.status(401).send({message:"unauthorized access"});
         }
     } catch (error) {
        res.status(500).send({ message: "internal server error" });
     }
}


app.listen(PORT,async ()=>{
    try {
        await connect;
        console.log("Connected");
    } catch (error) {
        console.log("Not Connecting");
    }
});


