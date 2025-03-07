import { Request, Response, NextFunction } from "express";
import { Restaurant } from "../models/restaurant.model";
import uploadImageOnCloudinary from "../Utils/imageUpload";
import { Order } from "../models/order.model";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated";

export const createRestaurant = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;

        console.log("📥 Incoming request to create restaurant");

        if (!req.id) {
            res.status(401).json({ success: false, message: "Unauthorized: User ID missing" });
            return;
        }

        console.log(`🔑 User ID: ${req.id}`);

        const existingRestaurant = await Restaurant.findOne({ user: req.id });
        if (existingRestaurant) {
            res.status(400).json({ success: false, message: "Restaurant already exists for this user" });
            return;
        }

        if (!file) {
            res.status(400).json({ success: false, message: "Image is required" });
            return;
        }

        console.log("📂 Uploaded file:", file);

        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File).catch((err) => {
            console.error("❌ Cloudinary Upload Error:", err);
            return null;
        });

        if (!imageUrl) {
            res.status(500).json({ success: false, message: "Image upload failed" });
            return;
        }

        console.log("✅ Image uploaded to Cloudinary:", imageUrl);

        const parsedCuisines = Array.isArray(cuisines) ? cuisines : JSON.parse(cuisines || "[]");

        await Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: parsedCuisines,
            imageUrl
        });

        res.status(201).json({ success: true, message: "Restaurant Added Successfully" });
    } catch (error: any) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const getRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id }).populate('menus');
        if (!restaurant) {
            res.status(404).json({
                success: false,
                restaurant: [],
                message: "Restaurant not found"
            });
            return;
        }
        res.status(200).json({ success: true, restaurant });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};

export const updateRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
            return;
        }
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};

export const getRestaurantOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
            return;
        }
        const orders = await Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found"
            });
            return;
        }
        order.status = status;
        await order.save();
        res.status(200).json({
            success: true,
            status: order.status,
            message: "Status updated"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};

export const searchRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
        const query: any = {};

        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            ];
        }
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $regex: searchQuery, $options: 'i' } }
            ];
        }
        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines };
        }

        const restaurants = await Restaurant.find(query);
        res.status(200).json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};

export const getSingleRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path: 'menus',
            options: { createdAt: -1 }
        });
        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
            return;
        }
        res.status(200).json({ success: true, restaurant });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
};