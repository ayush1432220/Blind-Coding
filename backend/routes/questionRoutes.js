import express from "express";
import {  getAssignedQuestion } from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/assigned", protect, getAssignedQuestion);


export default router;
