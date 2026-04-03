import express from "express";
import { 
  // createOrder,
  getMyOrders,
  // getSingleOrder,
  // cancelOrder
} from "../controller/orderController.js";

import { varify } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new order
// router.post("/", varify, createOrder);

// Get all my orders
router.get("/", varify, getMyOrders);

// Get single order by id
// router.get("/:id", varify, getSingleOrder);

// Cancel an order
// router.put("/:id/cancel", varify, cancelOrder);

export default router;
