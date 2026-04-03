import bcrypt from "bcryptjs";
import { User } from "../model/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import sendError from "../utils/errorHandle.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    // await fetch("http://localhost:5678/webhook-test/21118e8d-54e3-4881-b601-3f00f297cb90", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: user.name,
    //     email: user.email,
    //   }),
    // });

    res
      .status(201)
      .cookie("token", generateToken(user._id), {
        httpOnly: true,
        secure: false, // true ONLY in production (https)
        sameSite: "lax", // 👈 works for localhost
      })
      .json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          varified: user.varified,
          notification: user.notify,
        },
      });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error while register", err });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    return res
      .status(200)
      .cookie("token", generateToken(user._id), {
        httpOnly: true,
        secure: false, // true ONLY in production (https)
        sameSite: "lax", // 👈 works for localhost
      })
      .json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          varified: user.varified,
          notification: user.notify,
        },
      });
  } catch (err) {
    sendError(500, err.message);
  }
};

export const logout = async (req, res) => {
  try {
    // remove jwt cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    sendError(500, err.message);
  }
};
