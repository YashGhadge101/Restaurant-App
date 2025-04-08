import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  createCheckoutSession,
  getOrders,
  stripeWebhook,
} from "../Controller/order.controller";

const router = express.Router();

router.post("/checkout/create-checkout-session", isAuthenticated, createCheckoutSession);
router.get("/user", isAuthenticated, getOrders);
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
