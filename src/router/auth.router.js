import {Router} from "express";
import * as authcontroller from "../controllers/auth.controller.js";
import upload from "../middleware/upload.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
const authRouter = Router();

authRouter.post("/register", authcontroller.register)

authRouter.post("/Login" , authcontroller.Login)


authRouter.get("/GetMe", authcontroller.GetMe)

authRouter.get("/refreshtoken" , authcontroller.refreshtoken)

authRouter.post("/Logout" , authenticate, authcontroller.Logout)

authRouter.post("/LogoutAll" , authenticate, authcontroller.LogoutAll)

 export default authRouter;    


 
