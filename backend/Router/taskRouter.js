const express = require("express");

const taskModel = require("../Model/taskModel");

const taskRouter = express.Router();

taskRouter.get("/tasks", async (req, res) => {
    const {id} = req.body;
    const { page = 1, startDate, endDate, status,q } = req.query;
    const limit = 8;
    const skip = (page - 1) * limit;
    const query = {userId:id};
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }
    if(q){
        query["title"]=q;
    }
    if (status === "completed" || status === "pending") {
        query.status = status === "completed";
    }
    
    try {
        const totalCount = await taskModel.countDocuments(query);
        const tasks = await taskModel.find(query).skip(skip).limit(limit);
        return res.status(200).send({message:"successfull",tasks:tasks,page:totalCount>limit?Math.ceil(totalCount/limit):1});
    } catch (error) {
        return res.status(500).send({ message: "internal server error" });
    }
});

taskRouter.post("/post",async(req,res)=>{
    const {id,title,description,status} = req.body;
    console.log(id,title,description,status)
    try {
        const dateTime=new Date();
        console.log(dateTime)
        const setTask = await taskModel({
            title,
            description,
            createdAt: dateTime, 
            updatedAt: "Not updated", 
            status,
            userId: id
        });
        await setTask.save();
        return res.status(200).send({message:"successfull"});
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "internal server error" });
    }
});


taskRouter.put("/update/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status } = req.body;
    try {
        const dateTime=new Date();
        const task = await taskModel.findByIdAndUpdate(taskId, {
            title,
            description,
            status,
            updatedAt: dateTime
        });
        return res.status(200).send({ message: "successfull" });
    } catch (error) {
        return res.status(500).send({ message: "internal server error" });
    }
});


taskRouter.delete("/delete/:taskId", async (req, res) => {
    const { taskId } = req.params;
    try {
        await taskModel.findByIdAndDelete(taskId);
        return res.status(200).send({ message: "successfull" });
    } catch (error) {
        return res.status(500).send({ message: "internal server error" });
    }
});

module.exports = taskRouter;
