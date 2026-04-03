import express from "express";
import { varify } from "../middleware/authMiddleware.js";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  // clearWishlist,
} from "../controller/wishlistController.js";

const router = express.Router();

// Protected routes
router.post("/add", varify, addToWishlist);
router.get("/", varify, getWishlist);
router.delete("/remove/:productId", varify, removeFromWishlist);
// router.delete("/clear", varify, clearWishlist);

export default router;
