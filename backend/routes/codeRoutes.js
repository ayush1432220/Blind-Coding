import express from "express";
import { submitCode, getSubmissionStatus } from "../controllers/codeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", protect, submitCode);
router.get("/submission/:id", protect, getSubmissionStatus);

export default router;