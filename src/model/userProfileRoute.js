import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controller/userController.js";

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile/update", auth, updateProfile);

export default router;
