import bcrypt from "bcryptjs";
import { User } from "../model/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import sendError from "../utils/errorHandle.js";

// Rate limiting for routes (/login and /register) from brute-force attacks, credential stuffing, and Denial of Service (DoS) attempts.

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
      return res.status(400).json({message:"please send all required details"})
    }

    const existing = await User.findOne({ email });
    if (existing){
      return res.status(400).json({ message: "Email already exists" });
    }

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
    return res.status(500).json({ message: "An unexpected error occurred during registration."});
  }
};
// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({message:"Please fill all required field"})
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user){
      // Execute a dummy hash check to consume the same time an actual check takes
      // This tricks timing-analysis tools into thinking the email was found
      await bcrypt.compare("dummy_password", "$2b$10$fakehashstringtofooleveryone...");
      return res.status(401).json({ success: false, message: "Invalid credentials" }); 
      // Note: 401 Unauthorized is semantically cleaner than 400 for auth failures
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

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
    console.log("while login",err)
    return res.status(500).json({ message: "An unexpected error occurred during registration."});
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
