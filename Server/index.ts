import express from "express";
import connectDB from "./db/ConnectDB";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const DIRNAME = path.resolve();


// CORS
app.use(cors({
    origin: ["https://FOOD_APP.onrender.com"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parser & Cookie parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

app.use(express.static(path.join(DIRNAME,"client/dist")));
app.use("*",(_,res) => {
    res.sendFile(path.resolve(DIRNAME,"client","dist","index.html"));
})

app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
