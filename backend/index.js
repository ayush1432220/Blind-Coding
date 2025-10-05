import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.194.76:5173",
  "http://192.168.230.56:5173",
  "http://192.168.230.228:5173",
  "http://192.168.215.77:5173",
  'http://192.168.215.76:5173',
  "https://blind-coding-snowy.vercel.app",
  "http://192.168.230.89:5173",
  "http://172.16.11.163:5173",
  "http://192.168.62.76:5173",
  "http://172.16.10.244:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log(`Cors is called`);
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/security", securityRoutes);

app.get("/", (req, res) => {
  res.send("Blind Coding API is running...");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
