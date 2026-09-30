import userModel from "../Models/User.Models.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";




    export async function register(req , res) {

    
        const { First_Name , Last_Name , Email , Password } = req.body;

        const isAlreadyRegistered = await userModel.findOne({ Email });

        if (isAlreadyRegistered) {
            return res.status(409).json({
                message : "Email is already existing "
            });
        }
        const hashedPassword =crypto.createHash("sha256").update(Password).digest("hex")
        const user = await userModel.create({ First_Name , Last_Name , Email , Password : hashedPassword});
            
        
        const accesstoken = jwt.sign({
            id : user._id 
        } , config.JWT_SECRET ,{
            expiresIn : "15m"
        } )

        const refreshtoken = jwt.sign({
            id : user._id 
        }, config.JWT_SECRET ,
    {
        expiresIn : "7d"
    })

    res.cookie ("refreshtoken" , refreshtoken , {
       
        httpOnly : true ,
        sameSite : "strict",
        Secure : true ,
        maxAge : 7 * 24 * 60 * 60 * 1000
       } )

        res.status(201).json({
            message:"user registered successfully ",
            user : {
                First_Name : user.First_Name,
                Last_Name : user.Last_Name,
                Email : user.Email,
                Password : user.Password 
            
            }, 
            accesstoken, 
        })

    }

   export async function Login(req, res) {
    const { Email, Password } = req.body;

    
    if (!Email || !Password) {
        return res.status(400).json({
            message: "Email and Password are required"
        });
    }

    
    const user = await userModel.findOne({ Email });

    if (!user) {
        return res.status(401).json({
            message: "Email or Password is incorrect!"
        });
    }

    const hashedPassword = crypto
        .createHash("sha256")
        .update(Password)
        .digest("hex");

    
    const isPasswordValid = hashedPassword === user.Password;

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Email or Password is incorrect!"
        });
    }

    
    return res.status(200).json({
        message: "Login successful"
    });
}

export const uploadResume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",

            file: {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                size: req.file.size,
                path: req.file.path
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Resume upload failed",
            error: error.message
        });
    }
}



    export async function GetMe(req , res ){

const token = req.headers.authorization?.split(" ")[1];

if (!token ) {
    message : "no token fetched "
}

const decoded = jwt.verify(token , config.JWT_SECRET)
const user = await userModel.findById(decoded.id) 

res.status(200).json({
    message : "user fetched successfully",
    user : {
        First_Name : user.First_Name ,
        Email : user.Email 
    }
})
    }
 

    export async function refreshtoken(req ,res ) {

        const refreshtoken = req.cookies.refreshtoken;

        if(!refreshtoken){
            res.status(401).json({
                message : "token not found !"
            });
            
        } 
    

        const decoded = jwt.verify(refreshtoken , config.JWT_SECRET );

        const accesstoken = jwt.sign({
            id : decoded.id }, config.JWT_SECRET ,{
            expiresIn : "15m"
        });

        const newrefreshtoken = jwt.sign({
            id : decoded.id 
        }, config.JWT_SECRET , {
            expiresIn : "7d"
        });
        res.cookie ("refreshtoken" , newrefreshtoken , {
            
            httpOnly : true ,
            secure : true, 
            sameSite : "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message : "access token refreshed ! ",
            accesstoken
        })
        
    }

   

export async function Logout  (req, res)  {
    try {

    
        const userId = req.user.id;

    
        await userModel.findByIdAndUpdate(
            userId,
            {
                $unset: {
                    refreshToken: 1
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Loged out successfully"
        });

    } catch (error) {

        console.error("Logout Error:", error);

        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        });
    }
} 

    export async function LogoutAll(req, res) {
    try {
        const refreshToken = req.cookies.refreshtoken;

        console.log("req.cookies =", req.cookies);
        console.log("refreshToken =", refreshToken);
        console.log("type =", typeof refreshToken);

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found!"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET
        );

        console.log("decoded =", decoded);

        await sessionModel.updateMany(
            {
                user: decoded.id,
                revoked: false
            },
            {
                $set: {
                    revoked: true
                }
            }
        );

        res.clearCookie("refreshtoken");

        return res.status(200).json({
            message: "Logged out from all devices successfully"
        });

    } catch (error) {
        console.error("LogoutAll error:", error);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}

