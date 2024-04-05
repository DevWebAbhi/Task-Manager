const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    deadline: {type:Date, required: true},
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date},
    status: {type: Boolean, required: true},
    userId: {type: String, required: true}
});
const taskModel = mongoose.model("tasks-data",schema);
module.exports = taskModel;