import express from "express";
import {
  getAllParticipants,
  getAllSubmissions,
  exportSubmissions,
  getSecurityLogs,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/participants", protect, admin, getAllParticipants);
router.get("/submissions", protect, admin, getAllSubmissions);
router.get("/export", protect, admin, exportSubmissions);
router.get("/security-logs", protect, admin, getSecurityLogs);


export default router;
