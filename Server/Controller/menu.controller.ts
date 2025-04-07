import { Request, Response } from "express";
import uploadImageOnCloudinary from "../Utils/imageUpload";
import { Menu, IMenuDocument } from "../models/menu.model";
import { Restaurant, IRestaurantDocument } from "../models/restaurant.model";
import mongoose from "mongoose";

interface CreateMenuRequest {
    name: string;
    description: string;
    price: string;
    restaurantId?: string;
}

interface EditMenuRequest {
    name?: string;
    description?: string;
    price?: string;
}

interface AddMenuRequest {
    name: string;
    description: string;
    price: string;
    restaurantId?: string; // ADDED THIS TO SUPPORT ADMIN-SIDE CREATION
}

// ✅ ADD MENU (ADMIN OR USER)
export const addMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, restaurantId }: AddMenuRequest = req.body;
        const file = req.file;

        if (!name || !description || !price || !file) {
            res.status(400).json({
                success: false,
                message: "Name, description, price, image, and restaurantId are required.",
            });
            return;
        }

        let finalRestaurant: IRestaurantDocument | null = null;

        if (restaurantId) {
            finalRestaurant = await Restaurant.findById(restaurantId);
        } else {
            finalRestaurant = await Restaurant.findOne({ user: req.id });
        }

        if (!finalRestaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found.",
            });
            return;
        }

        const imageUrl = await uploadImageOnCloudinary(file);

        const createdMenu:any = await Menu.create({
            name,
            description,
            price: Number(price),
            image: imageUrl,
            restaurantId: finalRestaurant._id,
        });

        finalRestaurant.menus.push(createdMenu._id);
        await finalRestaurant.save();

        res.status(201).json({
            success: true,
            message: "Menu added successfully.",
            menu: createdMenu,
        });
    } catch (error) {
        console.error("Error adding menu:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add menu. Please try again later.",
        });
    }
};

// ✅ CREATE MENU (EXPLICIT RESTAURANT SELECTION)
export const createMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, restaurantId }: CreateMenuRequest = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ success: false, message: "Image is required" });
            return;
        }

        let finalRestaurantId: string;

        if (restaurantId && typeof restaurantId === "string") {
            finalRestaurantId = restaurantId;
        } else {
            const restaurant:any = await Restaurant.findOne({ user: req.id });
            if (!restaurant) {
                res.status(404).json({
                    success: false,
                    message: "Restaurant not found for the logged-in user.",
                });
                return;
            }
            finalRestaurantId = restaurant._id.toString();
        }

        const restaurantExists = await Restaurant.findById(new mongoose.Types.ObjectId(finalRestaurantId));
        if (!restaurantExists) {
            res.status(404).json({ success: false, message: "Restaurant not found." });
            return;
        }

        const imageUrl = await uploadImageOnCloudinary(file);

        const createdMenu:any = await Menu.create({
            name,
            description,
            price: Number(price),
            image: imageUrl,
            restaurantId: finalRestaurantId,
        });

        restaurantExists.menus.push(createdMenu._id);
        await restaurantExists.save();

        res.status(201).json({ success: true, message: "Menu created", menu: createdMenu });
    } catch (error) {
        console.error("Error creating menu:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ EDIT MENU
export const editMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price }: EditMenuRequest = req.body;
        const file = req.file;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid menu ID format:", id);
            res.status(400).json({ success: false, message: "Invalid menu ID format." });
            return;
        }

        const menu = await Menu.findById(id);

        if (!menu) {
            console.error("Menu not found:", id);
            res.status(404).json({ success: false, message: "Menu not found with the provided ID." });
            return;
        }

        if (name) menu.name = name;
        if (description) menu.description = description;
        if (price) menu.price = Number(price);

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }

        await menu.save();

        res.status(200).json({ success: true, message: "Menu updated successfully.", menu });
    } catch (error) {
        console.error("Error editing menu:", error);
        res.status(500).json({ success: false, message: "Failed to update menu. Please try again later." });
    }
};
