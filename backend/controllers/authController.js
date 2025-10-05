import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import sanitizeHtml from 'sanitize-html';


const generateToken = (res, userId, userRole) => {
  const token = jwt.sign(
    { id: userId, role: userRole },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax", 
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const registerUser = async (req, res) => {
  console.log("Register route is called")
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

     const sanitizedName = sanitizeHtml(name, {
            allowedTags: [], 
            allowedAttributes: {},
        });
    const user = await User.create({ name: sanitizedName, email, password });
    if (user) {
      generateToken(res, user._id, user.role);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  console.log('Login route is called')
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id, user.role);
      console.log("Login successful, Cookie should be set now!");

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching user profile" });
  }
};