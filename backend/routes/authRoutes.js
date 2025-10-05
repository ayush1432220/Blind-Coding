import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  (req,res,next)=>{
    console.log(`Register Route is called`)
    next()
  },
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Password must be 8 or more characters with a number, an uppercase and a lowercase letter"
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
  ],
  registerUser
);

router.post("/login", (req,res,next)=>{
  console.log(`Login route is called`)
  next()
},loginUser);
router.post("/logout", logoutUser); 
router.get("/me", protect, getMe);

export default router;
