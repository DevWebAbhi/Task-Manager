const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    createdAt: {type: String, required: true},
    updatedAt: {type: String, required: true},
    status: {type: Boolean, required: true},
    userId: {type: String, required: true}
});

const taskModel = mongoose.model("tasks",schema);

module.exports = taskModel;