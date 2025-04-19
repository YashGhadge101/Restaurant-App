import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  createCheckoutSession,
  getOrders,
  stripeWebhook,
  updateOrderStatus
} from "../Controller/order.controller";

const router = express.Router();

router.post("/checkout/create-checkout-session", isAuthenticated, createCheckoutSession);
router.get("/user", isAuthenticated, getOrders);
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
router.put("/:orderId/status", isAuthenticated, updateOrderStatus);

export default router;
