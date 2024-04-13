const express = require("express");
const taskModel = require("../Model/taskModel");
const taskAlertMailer = require("../taskAlertMailer");
const taskRouter = express.Router();

taskRouter.post("/post", async (req, res) => {
    const { id, title, description, status, deadline, email } = req.body;
    console.log(email)
    try {
        // Get the current timezone offset in minutes
        const offset = 330;
        
        // Convert the offset to milliseconds
        const offsetMilliseconds = offset * 60 * 1000;

        // Get the current time adjusted for the offset
        const now = new Date(Date.now() + offsetMilliseconds);

        // Convert the deadline to a Date object
        const deadlineDate = new Date(deadline);

        // Apply the offset to the deadline
        const deadlineWithOffset = new Date(deadlineDate.getTime());

        // Check if the deadline is at least 10 minutes in the future
        if (deadlineWithOffset.getTime() - now.getTime() < 10 * 60 * 1000) {
            return res.status(200).send({ message: "Deadline should be at least 10 minutes in the future" });
        }

        const setTask = await taskModel({
            title,
            description,
            createdAt: now,
            status,
            deadline: deadlineWithOffset,
            userId: id
        });
        await setTask.save();

        console.log('Task created at:', now);
        console.log('Deadline:', deadlineWithOffset);

        // Calculate the time difference for the timeout
        const timeDiff = deadlineWithOffset.getTime() - now.getTime() - 5 * 60 * 1000; // Adjust for 5 minutes before deadline

        setTask.timeout = setTimeout(async() => {
            console.log(`Deadline reached for task: ${title} ${email}`);
            await taskAlertMailer(email,title,description);
        }, timeDiff);

        return res.status(200).send({ message: "successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "internal server error" });
    }
});

taskRouter.put("/update/:taskId", async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, deadline, email } = req.body;

    try {
        // Get the current timezone offset in minutes
        const offset = 330;
        
        // Convert the offset to milliseconds
        const offsetMilliseconds = offset * 60 * 1000;

        // Get the current time adjusted for the offset
        const now = new Date(Date.now() + offsetMilliseconds);

        // Convert the deadline to a Date object
        const deadlineDate = new Date(deadline);

        // Apply the offset to the deadline
        const deadlineWithOffset = new Date(deadlineDate.getTime());

        // Check if the deadline is at least 10 minutes in the future
        if (deadlineWithOffset.getTime() - now.getTime() < 10 * 60 * 1000) {
            return res.status(200).send({ message: "Deadline should be at least 10 minutes in the future" });
        }

        const updatedTask = await taskModel.findByIdAndUpdate(taskId, {
            title,
            description,
            status,
            deadline: deadlineWithOffset,
            updatedAt: now 
        });

        console.log('Task updated at:', now);
        console.log('Updated deadline:', deadlineWithOffset);

        if (updatedTask.timeout) {
            clearTimeout(updatedTask.timeout);
        }

        // Calculate the time difference for the timeout
        const timeDiff = deadlineWithOffset.getTime() - now.getTime() - 5 * 60 * 1000; // Adjust for 5 minutes before deadline

        updatedTask.timeout = setTimeout(async() => {
            console.log(`Updated deadline reached for task: ${title}`);
            await taskAlertMailer(email,title,description);
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
        return res.status(200).send({ message: "successful" });
    } catch (error) {
        return res.status(500).send({ message: "internal server error" });
    }
});

taskRouter.get("/tasks", async (req, res) => {
    const { id } = req.body;
    const { page = 1, startDate, endDate, status, q } = req.query;
    const limit = 6;
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
        return res.status(200).send({ message: "successful", tasks: tasks, page: totalCount > limit ? Math.ceil(totalCount / limit) : 1 });
    } catch (error) {
        return res.status(500).send({ message: "internal server error" });
    }
});

module.exports = taskRouter;
