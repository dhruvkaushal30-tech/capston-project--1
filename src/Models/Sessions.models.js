import mongoose from "mongoose";
import { refreshtoken } from "../controllers/auth.controller";

const sessionschema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "users",
        required : [true , "user is required "]
    },
    refreshtokenhash : {
        type : String,
        required : [true , "refresh token is required "]
    },
    ip : {
        type : String,
        required : [true , "IP adress is required "]
    },
    userAgent :{
       type : String,
    required : [true , "user agent is required "]},
    revoked : {
        type : Boolean,
        default : false 

    },
},
    {
        timestamps: true
    }

);

const sessionModels = mongoose.model("sessions", sessionschema);

export default sessionModels 