const express = require("express");
const dayjs = require('dayjs');

const taskModel = require("../Model/taskModel");

const taskRouter = express.Router();

taskRouter.post("/post", async (req, res) => {
    const { id, title, description, status, deadline } = req.body;

    try {
        const dateTime = new Date();
        const setTask = await taskModel({
            title,
            description,
            createdAt: dateTime,
            status,
            deadline,
            userId: id
        });
        await setTask.save();

        const timeDiff = dayjs(deadline).subtract(5, 'minutes').diff(dayjs(), 'milliseconds');

        setTask.timeout = setTimeout(() => {
            console.log(`Deadline reached for task: ${title}`);
        }, timeDiff);

        return res.status(200).send({ message: "successfull" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "internal server error" });
    }
});

taskRouter.put("/update/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, deadline } = req.body;

    try {
        const dateTime = new Date();
        const updatedTask = await taskModel.findByIdAndUpdate(taskId, {
            title,
            description,
            status,
            deadline,
            updatedAt: dateTime
        });

        if (updatedTask.timeout) {
            clearTimeout(updatedTask.timeout);
        }

        const timeDiff = dayjs(deadline).subtract(5, 'minutes').diff(dayjs(), 'milliseconds');

        updatedTask.timeout = setTimeout(() => {
            console.log(`Updated deadline reached for task: ${title}`);
        }, timeDiff);

        return res.status(200).send({ message: "Successfully updated task" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error" });
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

taskRouter.get("/tasks", async (req, res) => {
    const { id } = req.body;
    const { page = 1, startDate, endDate, status, q } = req.query;
    const limit = 8;
    const skip = (page - 1) * limit;
    const query = { userId: id };
    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    } else if (startDate) {
        query.createdAt = {
            $gte: new Date(startDate),
        };
    } else if (endDate) {
        query.createdAt = {
            $lte: new Date(endDate)
        };
    }
    if (q) {
        query["title"] = q;
    }
    if (status === "completed" || status === "pending") {
        query.status = status === "completed";
    }

    try {
        const totalCount = await taskModel.countDocuments(query);
        const tasks = await taskModel.find(query).skip(skip).limit(limit);
        return res.status(200).send({ message: "successfull", tasks: tasks, page: totalCount > limit ? Math.ceil(totalCount / limit) : 1 });
    } catch (error) {
        return res.status(500).send({ message: "internal server error" });
    }
});

module.exports = taskRouter;
