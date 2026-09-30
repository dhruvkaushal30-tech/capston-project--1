import mongoose from "mongoose";

const  UserSchema = new mongoose.Schema({

    First_Name : {
        type : String,
        required : [true , "First_Name is required"]

    },
    Last_Name: {
        type : String,
        required : [true ,"Last_Name is required"]
    },

    Email : {
        type : String,
        required : [true , "email is required" ],
        unique : [true , "email must be unique"]

    },

    Password : {
        type : String,
        required : [true , "password is required "]

    }


})

const userModel = mongoose.model("user", UserSchema )

export default userModel; 
