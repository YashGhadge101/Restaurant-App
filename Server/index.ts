import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./db/ConnectDB";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

// Routes
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import { stripeWebhook } from "./Controller/order.controller";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DIRNAME = path.resolve();

// ⚠️ Stripe Webhook should be before express.json()
app.post(
  "/api/v1/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json()); // Must come after webhook
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute); // All order routes EXCEPT webhook

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
