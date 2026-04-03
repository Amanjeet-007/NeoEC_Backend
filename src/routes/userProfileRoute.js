import express from "express";
import { varify } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controller/userController.js";

const router = express.Router();

router.get("/profile", varify, getProfile);
router.put("/profile/update", varify, updateProfile);

export default router;
