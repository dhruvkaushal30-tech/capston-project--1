import {Router} from "express"
import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadResume } from "../controllers/resume.controller.js";

const uploadrouter = Router();

uploadrouter.post(
    "/uploadResume",
    upload.single("resume"),
    uploadResume
);

export default uploadrouter;