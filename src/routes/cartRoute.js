import express from "express";
import { varify } from "../middleware/authMiddleware.js";

import {
  addToCart,
  getCart,
  // updateCart,
  removeFromCart,
  // clearCart,
} from "../controller/cartController.js";

const router = express.Router();

router.post("/add", varify, addToCart);
router.get("/", varify, getCart);
// router.put("/update", varify, updateCart);
router.delete("/remove/:id", varify, removeFromCart);
// router.delete("/clear", varify, clearCart);

export default router;
