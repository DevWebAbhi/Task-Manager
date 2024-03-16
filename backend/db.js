const mongoose = require("mongoose");

const MONGO_USERNAME = process.env.MONGO_USERNAME;

const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const connect = mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.7nsq8v0.mongodb.net/`);

module.exports=connect;     