const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    verified:{type:Boolean,required:true}
});

const userModel = mongoose.model("users",schema);


module.exports = userModel;