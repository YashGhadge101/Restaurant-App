import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/ConnectDB";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DIRNAME = path.resolve();

// ✅ Default middleware setup
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

// ✅ Updated CORS configuration
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3000"], // ✅ Allow frontend origin
    credentials: true, // ✅ Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allow common HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow required headers
};
app.use(cors(corsOptions));

// ✅ API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

// ✅ Start the server
app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
